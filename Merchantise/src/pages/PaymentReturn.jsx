import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import { RefreshCw, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

/**
 * PaymentReturn Page
 * 
 * This page handles the return from Cashfree redirect-based payments
 * (Net Banking, 3DS Card verification, etc.)
 * 
 * Cashfree redirects here with ?order_id=xxx after the customer
 * completes authentication on their bank's site.
 * 
 * Flow:
 * 1. Extract order_id from URL params
 * 2. Call backend /api/verify-payment to check order status via Cashfree API
 * 3. If PAID → confirm order, send to Google Sheets, navigate to receipt
 * 4. If not → show failure message
 */
export const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentOrder, confirmOrderPayment, showToast } = useCart();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed'
  const [errorMsg, setErrorMsg] = useState('');

  const orderIdFromUrl = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderIdFromUrl) {
        setStatus('failed');
        setErrorMsg('No order ID found. Please contact support.');
        return;
      }

      try {
        const urls = ['/api/verify-payment', '/.netlify/functions/verify-payment'];
        let data = null;

        for (const url of urls) {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: orderIdFromUrl })
            });
            const text = await res.text();
            if (text && !text.trim().startsWith('<')) {
              data = JSON.parse(text);
              break;
            }
          } catch (e) {
            // continue
          }
        }

        if (!data) {
          throw new Error('Failed to verify payment with server');
        }

        if (data.verified) {
          setStatus('success');

          // Confirm order + trigger Google Sheets
          const transactionRef = data.payment?.cf_payment_id 
            || data.payment?.bank_reference 
            || `CF-${data.cf_order_id}`;

          const confirmed = confirmOrderPayment(
            currentOrder?.orderId || orderIdFromUrl,
            transactionRef,
            'PAID - Verified',
            {
              gateway: 'Cashfree',
              method: data.payment?.payment_method?.toUpperCase() || 'REDIRECT'
            }
          );

          showToast('Payment verified & recorded! Generating order confirmation...', 'cart');

          // Navigate to receipt after a brief delay
          setTimeout(() => {
            navigate(`/order-success/${confirmed.orderId}`);
          }, 2000);
        } else {
          setStatus('failed');
          setErrorMsg(data.message || 'Payment could not be verified. If amount was deducted, it will be refunded.');
        }
      } catch (err) {
        console.error('Payment return verification error:', err);
        setStatus('failed');
        setErrorMsg('Could not verify payment. Please check your order status or contact support.');
      }
    };

    verifyPayment();
  }, [orderIdFromUrl]);

  return (
    <div className="payment-page-wrapper">
      <Navbar />
      <main className="payment-main-content">
        <div className="payment-container" style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          
          {status === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1557B0 0%, #0ea5e9 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <RefreshCw size={36} className="animate-spin" style={{ color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>Verifying Your Payment...</h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                Please wait while we confirm your payment with Cashfree.
                <br />Do not close this page.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                <ShieldCheck size={16} />
                <span>Secure verification in progress</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckCircle2 size={36} style={{ color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#059669' }}>Payment Successful!</h2>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Redirecting to your order receipt...
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertCircle size={36} style={{ color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626' }}>Payment Verification Failed</h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                {errorMsg}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="btn-primary"
                style={{ marginTop: '12px' }}
              >
                ← Go Back & Retry
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentReturn;
