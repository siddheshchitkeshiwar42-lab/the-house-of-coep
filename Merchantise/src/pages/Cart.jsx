import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import {
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount
  } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page-wrapper">
      <Navbar />

      <main className="cart-main-content">
        <div className="cart-container">
          
          {/* Breadcrumbs Navigation */}
          <nav className="cart-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Shopping Cart</span>
          </nav>

          {/* Cart Header */}
          <div className="cart-header">
            <div className="cart-title-group">
              <h1 className="cart-main-title">Your Cart</h1>
              <p className="cart-subtitle">Review your items before checkout.</p>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                className="cart-clear-all-btn"
                onClick={clearCart}
                title="Remove all items"
              >
                <Trash2 size={15} />
                <span>Clear Cart</span>
              </button>
            )}
          </div>

          {cartItems.length > 0 ? (
            /* 2-Column Cart Layout: Table List + Order Summary */
            <div className="cart-layout-grid">
              
              {/* Left Column: Cart Items List */}
              <div className="cart-items-column">
                
                {/* Desktop Table Headers */}
                <div className="cart-table-header">
                  <span className="col-product">Product</span>
                  <span className="col-price">Price</span>
                  <span className="col-qty">Quantity</span>
                  <span className="col-total">Total</span>
                  <span className="col-action"></span>
                </div>

                {/* Items List */}
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Bottom Navigation & Action Bar */}
                <div className="cart-bottom-actions">
                  <Link to="/shop" className="btn-secondary continue-shopping-btn">
                    <ArrowLeft size={16} />
                    <span>Continue Shopping</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Order Summary Card */}
              <div className="cart-summary-column">
                <OrderSummary onCheckout={() => navigate('/checkout')} />
              </div>

            </div>
          ) : (
            /* Empty Cart State */
            <div className="cart-empty-state">
              <div className="empty-cart-icon-circle">
                <ShoppingBag size={48} className="text-royal-blue" />
              </div>
              <h2 className="empty-cart-title">Your Cart is Empty</h2>
              <p className="empty-cart-text">
                Looks like you haven't added any official COEP merchandise yet. Explore our catalog and show your campus pride!
              </p>
              <div className="empty-cart-actions">
                <Link to="/shop" className="btn-primary">
                  <span>Explore Merchandise</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
