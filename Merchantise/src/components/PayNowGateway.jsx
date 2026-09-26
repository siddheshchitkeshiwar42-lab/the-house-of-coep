import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { PAYMENT_CONFIG, loadCashfreeSDK, initCashfree } from '../config/paymentConfig';
import { PaymentQR } from './PaymentQR';
import {
  CreditCard,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone,
  Building,
  Wallet,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  QrCode,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

export const PayNowGateway = ({
  orderId,
  amount,
  customer = {},
  items = [],
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'initiating' | 'verifying' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [showQrFallback, setShowQrFallback] = useState(false);

  // Method options for gateway
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI / Instant Pay',
      badge: 'Popular & Fast',
      description: 'Google Pay, PhonePe, Paytm, BHIM, CRED',
      icon: <Smartphone size={20} className="text-royal-blue" />,
      apps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED']
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      badge: 'Secure',
      description: 'Visa, MasterCard, RuPay, Maestro',
      icon: <CreditCard size={20} className="text-bright-blue" />,
      apps: ['Visa', 'MasterCard', 'RuPay']
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      badge: '50+ Banks',
      description: 'SBI, HDFC, ICICI, Axis, Kotak & more',
      icon: <Building size={20} className="text-indigo-600" />,
      apps: ['SBI', 'HDFC', 'ICICI', 'Axis']
    },
    {
      id: 'wallet',
      name: 'Wallets',
      badge: 'Instant',
      description: 'Paytm Wallet, PhonePe Wallet, Amazon Pay',
      icon: <Wallet size={20} className="text-emerald-600" />,
      apps: ['Amazon Pay', 'Mobikwik', 'Paytm']
    }
  ];

  /**
   * Verifies payment status with the backend after Cashfree checkout completes.
   * Backend calls Cashfree API using the secret key (never exposed to frontend).
  const callBackendApi = async (endpoint, body) => {
    const urls = [
      `/api/${endpoint}`,
      `/.netlify/functions/${endpoint}`
    ];
    let lastError = null;

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const text = await res.text();
        if (!text || text.trim().startsWith('<')) {
          continue; // Received HTML (SPA fallback), try next endpoint
        }

        const data = JSON.parse(text);
        return data;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error(`Failed to connect to /api/${endpoint}`);
  };

  /**
   * Verifies payment status with the backend after Cashfree checkout completes.
   * Backend calls Cashfree API using the secret key (never exposed to frontend).
   */
  const verifyPaymentWithBackend = async (cfOrderId) => {
    try {
      const data = await callBackendApi('verify-payment', { order_id: cfOrderId });
      return data;
    } catch (err) {
      console.error('Payment verification request failed:', err);
      return { verified: false, error: err.message };
    }
  };

  /**
   * Main "PAY NOW" Action Handler
   * 1. Creates a Cashfree order via backend → gets payment_session_id
   * 2. Opens Cashfree hosted checkout (modal with UPI, Cards, Net Banking, Wallets)
   * 3. Verifies payment with backend after checkout completes
   * 4. Triggers receipt + Google Sheets via onPaymentSuccess callback
   */
  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentStatus('initiating');
    setErrorMessage('');

    try {
      // ============================================================
      // STEP 1: Create Cashfree order via backend (secret key stays server-side)
      // ============================================================
      console.log('[PayNow] Creating Cashfree order for:', orderId, '| Amount:', amount);

      const orderData = await callBackendApi('create-order', { orderId, amount, customer, items });

      if (!orderData || !orderData.success || !orderData.payment_session_id) {
        throw new Error(orderData?.error || orderData?.details || 'Failed to create payment order. Please retry.');
      }

      console.log('[PayNow] Cashfree order created:', orderData.order_id, '| Session ID received');

      // ============================================================
      // STEP 2: Load Cashfree JS SDK and initialize
      // ============================================================
      const isSdkLoaded = await loadCashfreeSDK();

      if (!isSdkLoaded || !window.Cashfree) {
        throw new Error('Payment gateway could not be loaded. Please check your internet connection and retry.');
      }

      const cashfree = initCashfree();

      if (!cashfree) {
        throw new Error('Payment gateway initialization failed. Please retry.');
      }

      console.log('[PayNow] Opening Cashfree hosted checkout...');

      // ============================================================
      // STEP 3: Open Cashfree Hosted Checkout
      // On approved production domain (thehouseofcoep.netlify.app),
      // opens the sleek popup modal directly on the page.
      // On localhost, uses _self redirect so local testing works seamlessly.
      // ============================================================
      const isApprovedDomain = window.location.hostname.includes('thehouseofcoep.netlify.app');
      const checkoutResult = await cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: isApprovedDomain ? '_modal' : '_self'
      });

      console.log('[PayNow] Checkout result:', checkoutResult);

      // ============================================================
      // STEP 4: Handle checkout result
      // ============================================================

      // Case A: Checkout error or user dismissed
      if (checkoutResult.error) {
        console.warn('[PayNow] Checkout error/dismiss:', checkoutResult.error);

        // User closed modal without paying
        if (
          checkoutResult.error?.message?.toLowerCase().includes('user') ||
          checkoutResult.error?.message?.toLowerCase().includes('cancel') ||
          checkoutResult.error?.message?.toLowerCase().includes('dismiss') ||
          checkoutResult.error?.message?.toLowerCase().includes('close') ||
          checkoutResult.error?.code === 'USER_CANCELLED'
        ) {
          setIsProcessing(false);
          setPaymentStatus('idle');
          return;
        }

        // Payment failed (declined, insufficient balance, etc.)
        setIsProcessing(false);
        setPaymentStatus('failed');
        setErrorMessage(checkoutResult.error.message || 'Payment was declined or cancelled.');
        if (onPaymentFailure) onPaymentFailure(checkoutResult.error);
        return;
      }

      // Case B: Redirect-based payment (3DS, Net Banking)
      if (checkoutResult.redirect) {
        console.log('[PayNow] Redirected for additional authentication');
        // The return_url will handle post-payment verification on /payment-return
        return;
      }

      // Case C: Payment completed in modal — verify with backend
      setPaymentStatus('verifying');
      console.log('[PayNow] Verifying payment with backend...');

      // Small delay to ensure Cashfree has processed the payment
      await new Promise(resolve => setTimeout(resolve, 1500));

      const verificationResult = await verifyPaymentWithBackend(orderData.order_id);
      console.log('[PayNow] Verification result:', verificationResult);

      if (verificationResult.verified) {
        // ============================================================
        // STEP 5: Payment SUCCESS — trigger receipt + Google Sheets
        // ============================================================
        setPaymentStatus('success');
        console.log('[PayNow] ✅ Payment VERIFIED for order:', orderData.order_id);

        if (onPaymentSuccess) {
          onPaymentSuccess({
            transactionRef: verificationResult.payment?.cf_payment_id 
              || verificationResult.payment?.bank_reference 
              || `CF-${orderData.cf_order_id}`,
            gateway: 'Cashfree',
            method: verificationResult.payment?.payment_method?.toUpperCase() 
              || selectedMethod.toUpperCase(),
            cf_order_id: orderData.cf_order_id,
            order_id: orderData.order_id,
            payment_amount: verificationResult.order_amount,
            bank_reference: verificationResult.payment?.bank_reference,
            payment_time: verificationResult.payment?.payment_time
          });
        }
      } else {
        // ============================================================
        // Verification failed — maybe payment is still processing
        // ============================================================
        setPaymentStatus('failed');
        setErrorMessage(
          verificationResult.message || 
          'Payment verification pending. If amount was deducted, it will be auto-verified or refunded within 24 hours.'
        );
        if (onPaymentFailure) {
          onPaymentFailure({ description: verificationResult.message || 'Payment verification failed' });
        }
      }

    } catch (err) {
      console.error('[PayNow] Error:', err);
      setIsProcessing(false);
      setPaymentStatus('failed');
      setErrorMessage(err.message || 'Unable to initialize payment gateway. Please retry or use UPI QR.');
    }
  };

  return (
    <div className="paynow-gateway-card">
      {/* Header */}
      <div className="gateway-header">
        <div className="gateway-badge">
          <Zap size={14} className="text-royal-blue" />
          <span>OFFICIAL PAYMENT GATEWAY</span>
        </div>
        <h2 className="gateway-title">Complete Your Payment</h2>
        <p className="gateway-subtitle">
          Pay securely for Order <strong className="text-royal-blue">#{orderId}</strong>
        </p>
      </div>

      {/* Main Total Amount Hero Card */}
      <div className="gateway-amount-banner">
        <div className="amount-banner-content">
          <span className="amount-label">Total Payable Amount</span>
          <span className="amount-digits">{formatCurrency(amount)}</span>
        </div>
        <div className="amount-banner-security">
          <ShieldCheck size={24} className="text-emerald-500" />
          <span className="text-xs text-slate-300 font-medium">256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* Payment Methods Tabs */}
      <div className="payment-methods-section">
        <label className="section-label">Select Payment Method</label>
        <div className="methods-grid">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`method-tile ${isSelected ? 'selected' : ''}`}
              >
                <div className="method-tile-header">
                  <div className="method-icon-wrap">{method.icon}</div>
                  <span className={`method-badge ${isSelected ? 'bg-blue-100 text-royal-blue' : 'bg-slate-100 text-slate-600'}`}>
                    {method.badge}
                  </span>
                </div>
                <div className="method-tile-info">
                  <span className="method-name">{method.name}</span>
                  <span className="method-desc">{method.description}</span>
                </div>
                <div className={`method-radio-indicator ${isSelected ? 'active' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="gateway-error-banner flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs my-3">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary [ PAY NOW — ₹XXXX ] Button */}
      <div className="gateway-action-container">
        <button
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing || paymentStatus === 'success'}
          className="btn-primary paynow-main-btn w-full"
        >
          {paymentStatus === 'verifying' ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              <span>Verifying Payment with Gateway...</span>
            </>
          ) : paymentStatus === 'initiating' ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              <span>Connecting to Secure Gateway...</span>
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 size={20} className="text-white" />
              <span>Payment Verified Successfully!</span>
            </>
          ) : (
            <>
              <Lock size={18} />
              <span>PAY NOW — {formatCurrency(amount)}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Security Assurance Footer */}
      <div className="gateway-security-bar">
        <div className="security-item">
          <Lock size={14} className="text-emerald-600" />
          <span>PCI-DSS Compliant</span>
        </div>
        <div className="security-item">
          <ShieldCheck size={14} className="text-royal-blue" />
          <span>COEP Official Merchant</span>
        </div>
        <div className="security-item">
          <Zap size={14} className="text-amber-600" />
          <span>Instant Confirmation</span>
        </div>
      </div>

      {/* Optional Dynamic QR Fallback Accordion */}
      <div className="gateway-qr-fallback-accordion">
        <button
          type="button"
          onClick={() => setShowQrFallback(!showQrFallback)}
          className="qr-toggle-btn"
        >
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-royal-blue" />
            <span>Prefer another method? <strong>Pay using Dynamic UPI QR</strong></span>
          </div>
          {showQrFallback ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showQrFallback && (
          <div className="qr-fallback-body mt-4 pt-4 border-t border-slate-200">
            <PaymentQR
              orderId={orderId}
              amount={amount}
              upiId={PAYMENT_CONFIG.UPI_ID}
              payeeName={PAYMENT_CONFIG.PAYEE_NAME}
              onPaymentConfirmed={(txnRef) => {
                if (onPaymentSuccess) {
                  onPaymentSuccess({
                    transactionRef: txnRef,
                    gateway: 'UPI QR Fallback',
                    method: 'UPI_QR'
                  });
                }
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default PayNowGateway;
