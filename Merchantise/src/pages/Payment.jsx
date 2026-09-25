import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PayNowGateway } from '../components/PayNowGateway';
import { ProductImage } from '../components/ProductImage';
import { formatCurrency } from '../utils/formatCurrency';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import {
  ChevronRight,
  ShieldCheck,
  Lock,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck
} from 'lucide-react';

export const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, confirmOrderPayment, showToast } = useCart();

  // If no order in state or orderId mismatch, fallback gracefully
  const activeOrder = currentOrder || {
    orderId: orderId || 'COEP-2026-90421',
    totalAmount: 898,
    subtotal: 898,
    shippingFee: 0,
    discount: 0,
    items: [],
    customer: { fullName: 'COEP Customer', deliveryType: 'delivery', address: 'COEP Campus, Pune' }
  };

  const handlePaymentSuccess = (paymentDetails) => {
    const { transactionRef, gateway, method } = paymentDetails;
    const status = 'PAID - Verified';
    const confirmed = confirmOrderPayment(
      activeOrder.orderId,
      transactionRef,
      status,
      { gateway, method }
    );
    showToast('Payment verified & recorded! Generating order confirmation...', 'cart');
    navigate(`/order-success/${confirmed.orderId}`);
  };

  const handlePaymentFailure = (error) => {
    showToast(error?.description || 'Payment was cancelled or unsuccessful.', 'info');
  };

  return (
    <div className="payment-page-wrapper">
      <Navbar />

      <main className="payment-main-content">
        <div className="payment-container">
          
          {/* Breadcrumbs */}
          <nav className="payment-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/checkout" className="breadcrumb-link">Checkout</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Pay Now</span>
          </nav>

          {/* Payment Main Layout Grid */}
          <div className="payment-layout-grid">
            
            {/* Left: Production Pay Now Gateway Component */}
            <div className="payment-gateway-column">
              <PayNowGateway
                orderId={activeOrder.orderId}
                amount={activeOrder.totalAmount}
                customer={activeOrder.customer}
                items={activeOrder.items}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
              />
            </div>

            {/* Right: Order Summary Breakdown Card */}
            <div className="payment-summary-column">
              <div className="payment-summary-card">
                <div className="summary-card-header">
                  <h3 className="summary-title">Order Summary</h3>
                  <span className="order-id-badge">{activeOrder.orderId}</span>
                </div>

                {/* Items preview if available */}
                {activeOrder.items && activeOrder.items.length > 0 && (
                  <div className="payment-items-preview">
                    {activeOrder.items.map(({ product, quantity }) => (
                      <div key={product.id} className="payment-item-row">
                        <div className="payment-item-thumb">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            productId={product.id}
                            category={product.category}
                          />
                        </div>
                        <div className="payment-item-details">
                          <span className="payment-item-name">{product.name}</span>
                          <span className="payment-item-qty">Qty: {quantity}</span>
                        </div>
                        <span className="payment-item-price">
                          {formatCurrency(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="summary-divider"></div>

                {/* Subtotals & Total */}
                <div className="summary-rows-group">
                  <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-val">{formatCurrency(activeOrder.subtotal || activeOrder.totalAmount)}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="summary-row discount-row text-green-600 font-semibold">
                      <span className="summary-label text-green-600">
                        Coupon ({activeOrder.appliedCoupon?.code || 'FIRST100'})
                      </span>
                      <span className="summary-val text-green-600 font-bold">
                        - {formatCurrency(activeOrder.discount)}
                      </span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span className="summary-label">Shipping & Handling</span>
                    <span className="summary-val text-emerald-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span className="total-title">Total Amount</span>
                  <span className="total-amount">{formatCurrency(activeOrder.totalAmount)}</span>
                </div>

                {/* Customer Details Preview */}
                {activeOrder.customer && (
                  <div className="payment-customer-snapshot mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p><strong>Deliver To:</strong> {activeOrder.customer.fullName || 'COEP Student'}</p>
                    <p><strong>Contact:</strong> {activeOrder.customer.phone || activeOrder.customer.email}</p>
                    <p><strong>Address:</strong> {activeOrder.customer.address || 'COEP Campus, Pune'}</p>
                  </div>
                )}

                {/* Security Trust Note */}
                <div className="payment-instructions-box mt-4">
                  <h4 className="instructions-title flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck size={16} className="text-royal-blue" />
                    How Pay Now works:
                  </h4>
                  <ol className="instructions-list text-xs space-y-1 mt-1 text-slate-600">
                    <li>Click <strong>"PAY NOW"</strong> to launch the official secure gateway.</li>
                    <li>Select your payment mode (UPI, Cards, Net Banking, or Wallets).</li>
                    <li>Authorize transaction with your bank / UPI PIN.</li>
                    <li>Receive an instant invoice & verified order receipt!</li>
                  </ol>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
