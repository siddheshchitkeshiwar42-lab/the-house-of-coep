const crypto = require('crypto');
const https = require('https');

// ============================================================================
// CASHFREE CREDENTIALS — SERVER-SIDE ONLY
// ============================================================================
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || '';
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET || '';
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'production';

const CASHFREE_API_HOST = CASHFREE_ENV === 'production'
  ? 'api.cashfree.com'
  : 'sandbox.cashfree.com';

/**
 * Makes an HTTPS request to Cashfree APIs
 */
function cashfreeRequest(path, method) {
  return new Promise((resolve, reject) => {
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
        'Accept': 'application/json'
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
    req.end();
  });
}

/**
 * Verifies Cashfree webhook signature using HMAC-SHA256
 * Reference: https://docs.cashfree.com/docs/webhooks
 */
function verifyWebhookSignature(rawBody, timestamp, receivedSignature) {
  const payload = timestamp + rawBody;
  const computedSignature = crypto
    .createHmac('sha256', CASHFREE_CLIENT_SECRET)
    .update(payload)
    .digest('base64');
  return computedSignature === receivedSignature;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-webhook-timestamp',
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
    const body = JSON.parse(event.body);

    // =====================================================================
    // MODE 1: Webhook from Cashfree (automatic server-to-server notification)
    // Cashfree sends this when payment status changes
    // =====================================================================
    const webhookSignature = event.headers['x-webhook-signature'] || event.headers['X-Webhook-Signature'];

    if (webhookSignature) {
      const timestamp = event.headers['x-webhook-timestamp'] || event.headers['X-Webhook-Timestamp'] || '';
      
      console.log('[Cashfree Webhook] Received notification');

      // Verify webhook signature for authenticity
      const isSignatureValid = verifyWebhookSignature(event.body, timestamp, webhookSignature);

      if (!isSignatureValid) {
        console.error('[Cashfree Webhook] Signature verification FAILED');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ verified: false, error: 'Invalid webhook signature' })
        };
      }

      const webhookData = body.data || body;
      const paymentStatus = webhookData.payment?.payment_status || webhookData.order?.order_status;
      const orderId = webhookData.order?.order_id;
      const paymentId = webhookData.payment?.cf_payment_id;
      const paymentMethod = webhookData.payment?.payment_group || 'UNKNOWN';

      console.log(`[Cashfree Webhook] VERIFIED — Order: ${orderId} | Status: ${paymentStatus} | PaymentID: ${paymentId} | Method: ${paymentMethod}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          verified: true,
          order_id: orderId,
          payment_id: paymentId,
          payment_status: paymentStatus,
          message: 'Webhook processed successfully'
        })
      };
    }

    // =====================================================================
    // MODE 2: Frontend verification request (after Cashfree checkout returns)
    // Frontend sends order_id to verify payment status via Cashfree API
    // =====================================================================
    const { order_id } = body;

    if (!order_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ verified: false, error: 'Missing order_id' })
      };
    }

    console.log('[Cashfree] Verifying payment for order:', order_id);

    // Fetch order status from Cashfree API (server-to-server, using secret key)
    const orderResult = await cashfreeRequest(`/pg/orders/${order_id}`, 'GET');

    if (orderResult.statusCode >= 400) {
      console.error('[Cashfree] Order fetch failed:', orderResult.body);
      return {
        statusCode: orderResult.statusCode,
        headers,
        body: JSON.stringify({
          verified: false,
          error: 'Could not verify order with Cashfree',
          details: orderResult.body?.message || orderResult.body
        })
      };
    }

    const orderData = orderResult.body;
    const isPaid = orderData.order_status === 'PAID';

    // Fetch payment details for the transaction reference
    let paymentDetails = null;
    if (isPaid) {
      try {
        const paymentsResult = await cashfreeRequest(`/pg/orders/${order_id}/payments`, 'GET');
        if (paymentsResult.statusCode < 400 && Array.isArray(paymentsResult.body) && paymentsResult.body.length > 0) {
          const successfulPayment = paymentsResult.body.find(p => p.payment_status === 'SUCCESS') || paymentsResult.body[0];
          paymentDetails = {
            cf_payment_id: successfulPayment.cf_payment_id,
            payment_method: successfulPayment.payment_group || successfulPayment.payment_method,
            payment_amount: successfulPayment.payment_amount,
            payment_time: successfulPayment.payment_time,
            bank_reference: successfulPayment.bank_reference
          };
        }
      } catch (payErr) {
        console.warn('[Cashfree] Could not fetch payment details:', payErr.message);
      }
    }

    console.log(`[Cashfree] Order ${order_id} verification: ${isPaid ? 'PAID ✓' : orderData.order_status}`);

    return {
      statusCode: isPaid ? 200 : 400,
      headers,
      body: JSON.stringify({
        verified: isPaid,
        order_id: orderData.order_id,
        cf_order_id: orderData.cf_order_id,
        order_status: orderData.order_status,
        order_amount: orderData.order_amount,
        payment: paymentDetails,
        message: isPaid
          ? 'Payment verified successfully via Cashfree'
          : `Payment not completed. Order status: ${orderData.order_status}`
      })
    };
  } catch (err) {
    console.error('[Cashfree] verify-payment error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ verified: false, error: err.message })
    };
  }
};
