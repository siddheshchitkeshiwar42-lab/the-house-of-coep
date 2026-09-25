import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Eye, X, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ProductImage } from './ProductImage';

export const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div className="product-card" onClick={handleCardClick} role="button" tabIndex={0}>
        {/* Top Header Controls / Wishlist Button */}
        <div className="product-card-top-bar flex justify-end">
          <button
            type="button"
            className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist button"
          >
            <Heart size={18} fill={isWishlisted ? "#EF4444" : "none"} stroke={isWishlisted ? "#EF4444" : "#64748B"} />
          </button>
        </div>

        {/* Product Image Wrapper with Clear Fitting & Hover Quick View */}
        <div className="product-card-image-wrapper">
          <ProductImage
            src={product.image}
            alt={product.name}
            productId={product.id}
            category={product.category}
          />
          <button 
            type="button" 
            className="quick-view-overlay-btn"
            onClick={handleQuickViewClick}
            title="Quick Preview"
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
        </div>

        {/* Product Body Information */}
        <div className="product-card-body">
          <div className="product-category-row">
            <span className="product-category-tag">{product.category}</span>
          </div>

          <h3 className="product-title">{product.name}</h3>
          <p className="product-tagline">{product.tagline || (product.description ? product.description.substring(0, 45) + '...' : '')}</p>

          {/* Price & Action Button */}
          <div className="product-card-footer">
            <div className="price-display">
              <span className="price-amount">{formatCurrency(product.price)}</span>
            </div>

            <button
              type="button"
              className={`add-to-cart-btn ${isAdded ? 'added-success' : ''}`}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-End Quick View Modal */}
      {showQuickView && (
        <div className="quick-view-modal-backdrop" onClick={() => setShowQuickView(false)}>
          <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowQuickView(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="quick-view-grid">
              {/* Left: Product Visual Stage */}
              <div className="quick-view-img-box">
                <div className="quick-view-badge">
                  <Sparkles size={13} />
                  <span>Official Gear</span>
                </div>

                <div className="quick-view-img-wrapper">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    productId={product.id}
                    category={product.category}
                  />
                </div>

                <div className="quick-view-trust-mini">
                  <span className="trust-mini-tag">
                    <ShieldCheck size={14} className="text-royal-blue" /> Authentic COEP
                  </span>
                  <span className="trust-mini-tag">
                    <Zap size={14} className="text-amber-500" /> Instant UPI
                  </span>
                </div>
              </div>

              {/* Right: Product Details & Purchase Actions */}
              <div className="quick-view-info">
                <div className="quick-view-info-top">
                  <div className="quick-view-meta-row">
                    <span className="product-category-tag">{product.category}</span>
                  </div>

                  <h2 className="quick-view-title">{product.fullName || product.name}</h2>
                  
                  {product.tagline && (
                    <p className="quick-view-tagline">“{product.tagline}”</p>
                  )}

                  <div className="quick-view-price-row">
                    <span className="quick-view-price">{formatCurrency(product.price)}</span>
                    <span className="quick-view-tax-note">Inclusive of college taxes</span>
                  </div>

                  <p className="quick-view-desc">{product.description}</p>
                </div>

                <div className="quick-view-actions">
                  <button
                    type="button"
                    className={`btn-primary quick-view-cart-btn ${isAdded ? 'btn-success' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {isAdded ? (
                      <>
                        <Check size={17} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={17} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    className="quick-view-details-btn"
                    onClick={() => {
                      setShowQuickView(false);
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <span>Full Details</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
