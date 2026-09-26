const crypto = require('crypto');
const https = require('https');

// ============================================================================
// CASHFREE CREDENTIALS — SERVER-SIDE ONLY
// In production (Netlify), set these in the Netlify Dashboard Environment Variables.
// Locally, they are read from the .env file at the project root.
// ============================================================================
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || '';
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET || '';

// 'production' for live payments, 'sandbox' for testing
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'production';

const CASHFREE_API_HOST = CASHFREE_ENV === 'production'
  ? 'api.cashfree.com'
  : 'sandbox.cashfree.com';

/**
 * Makes an HTTPS request to Cashfree APIs
 */
function cashfreeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: CASHFREE_API_HOST,
      port: 443,
      path: path,
      method: method,
      headers: {
        'x-client-id': CASHFREE_CLIENT_ID,
        'x-client-secret': CASHFREE_CLIENT_SECRET,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(responseBody) });
        } catch {
          resolve({ statusCode: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount, orderId, customer, items } = JSON.parse(event.body);

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Generate a unique Cashfree order_id (must be alphanumeric with hyphens/underscores, max 45 chars)
    const cfOrderId = (orderId || `COEP-${Date.now()}`)
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .substring(0, 45);

    // Determine return URL (after 3DS / Net Banking redirect)
    const siteUrl = process.env.URL || process.env.VITE_SITE_URL || 'https://thehouseofcoep.netlify.app';

    // Construct Cashfree Create Order payload
    // Reference: https://docs.cashfree.com/reference/pgcreateorder
    const orderPayload = {
      order_id: cfOrderId,
      order_amount: parseFloat(Number(amount).toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: customer?.email
          ? customer.email.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45)
          : `coep_cust_${Date.now()}`,
        customer_name: (customer?.fullName || customer?.name || 'COEP Customer').substring(0, 100),
        customer_email: customer?.email || 'customer@coepmerch.in',
        customer_phone: (customer?.phone || customer?.mobile || '9999999999').replace(/[^0-9]/g, '').substring(0, 10)
      },
      order_meta: {
        return_url: `${siteUrl}/payment-return?order_id=${cfOrderId}`,
        notify_url: `${siteUrl}/.netlify/functions/verify-payment`
      },
      order_note: `COEP Merchandise Store - Order #${cfOrderId}`
    };

    console.log('[Cashfree] Creating order:', cfOrderId, '| Amount: ₹' + amount, '| Env:', CASHFREE_ENV);

    const result = await cashfreeRequest('/pg/orders', 'POST', orderPayload);

    if (result.statusCode >= 400) {
      console.error('[Cashfree] Order creation failed:', JSON.stringify(result.body));
      return {
        statusCode: result.statusCode,
        headers,
        body: JSON.stringify({
          error: 'Failed to create Cashfree order',
          details: result.body?.message || JSON.stringify(result.body)
        })
      };
    }

    console.log('[Cashfree] Order created successfully:', result.body.order_id, '| CF ID:', result.body.cf_order_id);

    // Return the payment_session_id to the frontend (NOT the secret key)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        cf_order_id: result.body.cf_order_id,
        order_id: result.body.order_id,
        payment_session_id: result.body.payment_session_id,
        order_status: result.body.order_status,
        order_amount: result.body.order_amount,
        order_currency: result.body.order_currency || 'INR'
      })
    };
  } catch (err) {
    console.error('[Cashfree] create-order error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
