import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ArrowRight, ShieldCheck, Zap, Tag, Check, X, Sparkles, Flame } from 'lucide-react';

export const OrderSummary = ({ onCheckout, showCheckoutButton = true }) => {
  const {
    totalAmount,
    totalItemsCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponUsageCount
  } = useCart();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState('');

  // Shipping is completely free
  const shippingFee = 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, totalAmount - discount);
  const remainingSpots = Math.max(0, 100 - couponUsageCount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const res = applyCoupon(promoCode);
    if (res.success) {
      setPromoCode('');
    }
  };

  const handleQuickApply = (code) => {
    applyCoupon(code);
  };

  const handleProceedToCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="order-summary-card">
      <h3 className="summary-title">Order Summary</h3>

      {/* Breakdown Rows */}
      <div className="summary-rows-group">
        <div className="summary-row">
          <span className="summary-label">Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
          <span className="summary-val">{formatCurrency(totalAmount)}</span>
        </div>

        {discount > 0 && (
          <div className="summary-row discount-row">
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <span>Coupon ({appliedCoupon?.code})</span>
              <button
                type="button"
                onClick={removeCoupon}
                className="coupon-remove-link"
                title="Remove Coupon"
              >
                <X size={13} />
              </button>
            </div>
            <span className="summary-val text-green-600 font-bold">- {formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Exclusive Coupon Banner / Hint */}
      {!appliedCoupon && remainingSpots > 0 && (
        <div className="coupon-hint-card" onClick={() => handleQuickApply('FIRST100')}>
          <div className="coupon-hint-badge">
            <Flame size={13} className="text-amber-500 fill-amber-500" />
            <span>First 100 Students Offer</span>
          </div>
          <div className="coupon-hint-body">
            <span className="coupon-hint-code">FIRST100</span>
            <span className="coupon-hint-desc">Get Flat ₹10 OFF on any order!</span>
          </div>
          <div className="coupon-hint-spots">
            <span className="spots-counter">{remainingSpots} spots remaining</span>
            <span className="tap-apply-text">Tap to apply →</span>
          </div>
        </div>
      )}

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="summary-promo-form">
        <div className="promo-input-wrap">
          <Tag size={16} className="promo-icon" />
          <input
            type="text"
            placeholder="Enter coupon code (e.g. FIRST100)"
            value={appliedCoupon ? appliedCoupon.code : promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="promo-input"
            disabled={!!appliedCoupon}
          />
          {appliedCoupon ? (
            <div className="flex items-center gap-2">
              <span className="promo-applied-badge">
                <Check size={14} /> -₹{appliedCoupon.discount} Applied
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                className="promo-clear-btn"
                title="Remove coupon"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="submit" className="promo-apply-btn">
              Apply
            </button>
          )}
        </div>
      </form>

      <div className="summary-divider"></div>

      {/* Final Total */}
      <div className="summary-total-row">
        <span className="total-title">Total</span>
        <div className="total-price-col">
          {discount > 0 && (
            <span className="original-total-strike">
              {formatCurrency(totalAmount + shippingFee)}
            </span>
          )}
          <span className="total-amount">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      {/* Proceed to Checkout CTA */}
      {showCheckoutButton && (
        <button
          type="button"
          className="btn-primary summary-checkout-btn"
          onClick={handleProceedToCheckout}
          disabled={totalItemsCount === 0}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </button>
      )}

      {/* Trust & Guarantee Strip */}
      <div className="summary-trust-footer">
        <div className="summary-trust-item">
          <Zap size={15} className="text-royal-blue shrink-0" />
          <span>Instant Dynamic UPI QR Pay</span>
        </div>
        <div className="summary-trust-item">
          <ShieldCheck size={15} className="text-royal-blue shrink-0" />
          <span>Official 100% Certified Merchandise</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
