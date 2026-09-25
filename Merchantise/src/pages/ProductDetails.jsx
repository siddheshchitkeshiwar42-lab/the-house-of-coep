import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  Info
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, showToast } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [copiedLink, setCopiedLink] = useState(false);

  // Find product by id
  const product = products.find((p) => p.id === id);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setIsAdded(false);
  }, [id]);

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <main className="product-not-found-main">
          <div className="not-found-container">
            <AlertCircle size={56} className="text-royal-blue mb-4" />
            <h1 className="text-2xl font-bold text-deep-navy mb-2">Product Not Found</h1>
            <p className="text-muted mb-6">
              The merchandise item you are looking for does not exist or may have been removed.
            </p>
            <Link to="/shop" className="btn-primary">
              <ArrowLeft size={18} />
              <span>Back to Shop</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  // Recommended / Related products (excluding current product)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < (product.stock || 50)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Product link copied to clipboard!', 'info');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const categoryObj = categories.find((c) => c.id === product.category);

  return (
    <div className="product-details-page">
      <Navbar />

      <main className="product-details-main">
        <div className="product-details-container">
          
          {/* Breadcrumbs Navigation */}
          <nav className="details-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/shop" className="breadcrumb-link">Shop</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-category">{categoryObj ? categoryObj.name : product.category}</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          {/* Product Overview Section */}
          <div className="product-details-grid">
            
            {/* Left: Product Visual Showcase */}
            <div className="product-gallery-column">
              <div className="product-main-visual-card">
                
                {/* Visual Header Tags */}
                <div className="visual-card-badges">
                  <span className="badge-official">
                    <Sparkles size={13} /> Official Gear
                  </span>
                  <button
                    type="button"
                    className={`details-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart size={20} fill={isWishlisted ? "#EF4444" : "none"} stroke={isWishlisted ? "#EF4444" : "#64748B"} />
                  </button>
                </div>

                {/* Main Product Image / Vector Graphic */}
                <div className="details-image-wrapper">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    productId={product.id}
                    category={product.category}
                    className="details-product-img"
                  />
                </div>

                {/* Footer Sub-bar with Trust Indicators */}
                <div className="visual-trust-strip">
                  <div className="trust-strip-item">
                    <ShieldCheck size={16} className="text-royal-blue" />
                    <span>100% Authentic COEP</span>
                  </div>
                  <div className="trust-strip-item">
                    <Truck size={16} className="text-royal-blue" />
                    <span>Direct Delivery Available</span>
                  </div>
                  <div className="trust-strip-item">
                    <Zap size={16} className="text-royal-blue" />
                    <span>Dynamic UPI QR Pay</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Product Information & Purchase Controls */}
            <div className="product-info-column">
              
              {/* Category */}
              <div className="info-meta-row">
                <span className="product-tag-pill">{product.categoryLabel || product.category}</span>
              </div>

              {/* Product Title & Tagline */}
              <h1 className="product-main-title">{product.fullName || product.name}</h1>
              {product.tagline && (
                <p className="product-main-tagline">“{product.tagline}”</p>
              )}

              {/* Price Row */}
              <div className="product-price-row">
                <div className="price-tag-wrap">
                  <span className="price-main">{formatCurrency(product.price)}</span>
                  <span className="price-tax-label">Inclusive of all college taxes</span>
                </div>
              </div>

              <div className="info-divider"></div>

              {/* Description */}
              <div className="product-description-block">
                <p>{product.description}</p>
              </div>

              {/* Key Features Bullet List */}
              {product.features && product.features.length > 0 && (
                <div className="key-features-list">
                  <h4 className="features-title">Highlights:</h4>
                  <ul>
                    {product.features.map((feat, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="text-bright-blue shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="info-divider"></div>

              {/* Quantity & CTA Actions */}
              <div className="purchase-controls-block">
                
                <div className="quantity-selector-row">
                  <label className="qty-label">Quantity</label>
                  <div className="qty-stepper-box">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={handleQuantityDecrease}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={handleQuantityIncrease}
                      disabled={quantity >= (product.stock || 50)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="subtotal-calc">
                    Total: <strong>{formatCurrency(product.price * quantity)}</strong>
                  </span>
                </div>

                {/* Primary CTA Buttons */}
                <div className="details-actions-row">
                  <button
                    type="button"
                    className={`btn-primary add-cart-large-btn ${isAdded ? 'btn-success' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {isAdded ? (
                      <>
                        <Check size={20} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-gold buy-now-btn"
                    onClick={handleBuyNow}
                  >
                    <Zap size={20} />
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    className="share-btn"
                    onClick={handleShare}
                    title="Share product link"
                    aria-label="Share"
                  >
                    {copiedLink ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Product Specifications & Information Tabs */}
          <section className="product-tabs-section">
            <div className="tabs-header">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Specifications & Details
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setActiveTab('delivery')}
              >
                Payment & Order Info
              </button>
            </div>

            <div className="tab-content-panel">
              {activeTab === 'features' && (
                <div className="specs-table-wrapper">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td className="spec-label">Product Name</td>
                        <td className="spec-value">{product.fullName || product.name}</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Category</td>
                        <td className="spec-value">{product.category} ({product.categoryLabel || 'Official'})</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Item Code</td>
                        <td className="spec-value font-mono">COEP-{product.id.toUpperCase()}-2026</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Key Features</td>
                        <td className="spec-value">
                          {product.features ? product.features.join(' · ') : 'Premium COEP Brand Material'}
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-label">Authenticity</td>
                        <td className="spec-value">100% Certified COEP Tech Merchandise</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="delivery-tab-content">
                  <div className="info-card-grid">
                    <div className="info-sub-card">
                      <h4 className="font-bold text-deep-navy mb-2 flex items-center gap-2">
                        <Zap size={18} className="text-royal-blue" />
                        UPI Payment System
                      </h4>
                      <p className="text-sm text-muted">
                        Instant zero-friction payment using any UPI app (Google Pay, PhonePe, Paytm, BHIM). Exact dynamic payment QR is generated upon checkout.
                      </p>
                    </div>

                    <div className="info-sub-card">
                      <h4 className="font-bold text-deep-navy mb-2 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-royal-blue" />
                        Order Confirmation
                      </h4>
                      <p className="text-sm text-muted">
                        Your order details and invoice are generated immediately with an official confirmation receipt upon payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Related / Complementary Products Section */}
          {relatedProducts.length > 0 && (
            <section className="related-products-section">
              <div className="related-section-header">
                <div>
                  <span className="section-eyebrow">EXPLORE MORE</span>
                  <h2 className="section-title">You May Also Like</h2>
                </div>
                <Link to="/shop" className="view-all-link">
                  <span>Browse All Products</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="related-products-grid">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
