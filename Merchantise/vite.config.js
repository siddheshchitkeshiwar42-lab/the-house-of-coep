import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'
import crypto from 'node:crypto'

/**
 * Cashfree Payment Dev Server Plugin
 * Proxies /api/create-order and /api/verify-payment during local development
 * so you don't need the Netlify CLI running for payment flows.
 */
function cashfreeDevPlugin() {
  return {
    name: 'cashfree-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''

        // ==========================================
        // CREATE ORDER — calls Cashfree /pg/orders
        // ==========================================
        if (url === '/.netlify/functions/create-order' || url === '/api/create-order') {
          if (req.method === 'POST') {
            let bodyStr = ''
            req.on('data', chunk => { bodyStr += chunk })
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}')
                const amount = body.amount
                const orderId = body.orderId || `COEP-${Date.now()}`
                const customer = body.customer || {}

                const env = loadEnv('development', process.cwd(), '')
                const clientId = env.CASHFREE_CLIENT_ID || process.env.CASHFREE_CLIENT_ID || '14438183e4274efff14131b1d6e8183441'
                const clientSecret = env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET || ''
                const cfEnv = env.CASHFREE_ENV || process.env.CASHFREE_ENV || 'production'
                const apiHost = cfEnv === 'production' ? 'api.cashfree.com' : 'sandbox.cashfree.com'

                const cfOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 45)
                // Cashfree production API requires an https return_url
                const siteUrl = env.VITE_SITE_URL || process.env.URL || 'https://thehouseofcoep.netlify.app'
                const returnUrl = `${siteUrl}/payment-return?order_id=${cfOrderId}`

                const payload = JSON.stringify({
                  order_id: cfOrderId,
                  order_amount: parseFloat(Number(amount).toFixed(2)),
                  order_currency: 'INR',
                  customer_details: {
                    customer_id: customer.email
                      ? customer.email.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45)
                      : `coep_cust_${Date.now()}`,
                    customer_name: customer.fullName || customer.name || 'COEP Customer',
                    customer_email: customer.email || 'customer@coepmerch.in',
                    customer_phone: customer.phone || customer.mobile || '9999999999'
                  },
                  order_meta: {
                    return_url: returnUrl
                  },
                  order_note: `COEP Merchandise Store - Order #${cfOrderId}`
                })

                const cfReq = https.request({
                  hostname: apiHost,
                  port: 443,
                  path: '/pg/orders',
                  method: 'POST',
                  headers: {
                    'x-client-id': clientId,
                    'x-client-secret': clientSecret,
                    'x-api-version': '2023-08-01',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                  }
                }, (cfRes) => {
                  let cfBody = ''
                  cfRes.on('data', d => { cfBody += d })
                  cfRes.on('end', () => {
                    res.setHeader('Content-Type', 'application/json')
                    try {
                      const jsonRes = JSON.parse(cfBody)
                      if (cfRes.statusCode >= 200 && cfRes.statusCode < 300) {
                        res.statusCode = 200
                        res.end(JSON.stringify({
                          success: true,
                          cf_order_id: jsonRes.cf_order_id,
                          order_id: jsonRes.order_id,
                          payment_session_id: jsonRes.payment_session_id,
                          order_status: jsonRes.order_status,
                          order_amount: jsonRes.order_amount,
                          order_currency: jsonRes.order_currency || 'INR'
                        }))
                      } else {
                        res.statusCode = cfRes.statusCode || 400
                        res.end(JSON.stringify({
                          success: false,
                          error: jsonRes.message || 'Cashfree order creation failed',
                          details: jsonRes
                        }))
                      }
                    } catch (e) {
                      res.statusCode = 500
                      res.end(JSON.stringify({ success: false, error: 'Failed to parse Cashfree response' }))
                    }
                  })
                })

                cfReq.on('error', (err) => {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ success: false, error: err.message }))
                })

                cfReq.write(payload)
                cfReq.end()
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: err.message }))
              }
            })
            return
          }
        }

        // ==========================================
        // VERIFY PAYMENT — calls Cashfree GET /pg/orders/:order_id
        // ==========================================
        if (url === '/.netlify/functions/verify-payment' || url === '/api/verify-payment') {
          if (req.method === 'POST') {
            let bodyStr = ''
            req.on('data', chunk => { bodyStr += chunk })
            req.on('end', () => {
              try {
                const body = JSON.parse(bodyStr || '{}')
                const { order_id } = body
                const env = loadEnv('development', process.cwd(), '')
                const clientId = env.CASHFREE_CLIENT_ID || process.env.CASHFREE_CLIENT_ID || '14438183e4274efff14131b1d6e8183441'
                const clientSecret = env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET || ''
                const cfEnv = env.CASHFREE_ENV || process.env.CASHFREE_ENV || 'production'
                const apiHost = cfEnv === 'production' ? 'api.cashfree.com' : 'sandbox.cashfree.com'

                if (!order_id) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ verified: false, error: 'Missing order_id' }))
                  return
                }

                const cfReq = https.request({
                  hostname: apiHost,
                  port: 443,
                  path: `/pg/orders/${order_id}`,
                  method: 'GET',
                  headers: {
                    'x-client-id': clientId,
                    'x-client-secret': clientSecret,
                    'x-api-version': '2023-08-01',
                    'Accept': 'application/json'
                  }
                }, (cfRes) => {
                  let cfBody = ''
                  cfRes.on('data', d => { cfBody += d })
                  cfRes.on('end', () => {
                    res.setHeader('Content-Type', 'application/json')
                    try {
                      const orderData = JSON.parse(cfBody)
                      const isPaid = orderData.order_status === 'PAID'
                      res.statusCode = isPaid ? 200 : 400
                      res.end(JSON.stringify({
                        verified: isPaid,
                        order_id: orderData.order_id,
                        cf_order_id: orderData.cf_order_id,
                        order_status: orderData.order_status,
                        order_amount: orderData.order_amount,
                        message: isPaid
                          ? 'Payment verified successfully via Cashfree'
                          : `Payment not completed. Order status: ${orderData.order_status}`
                      }))
                    } catch (err) {
                      res.statusCode = 500
                      res.end(JSON.stringify({ verified: false, error: 'Failed to parse Cashfree response' }))
                    }
                  })
                })

                cfReq.on('error', (err) => {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ verified: false, error: err.message }))
                })

                cfReq.end()
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ verified: false, error: err.message }))
              }
            })
            return
          }
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cashfreeDevPlugin()],
})
