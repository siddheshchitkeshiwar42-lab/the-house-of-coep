import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductImage } from '../components/ProductImage';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
  Lock,
  CreditCard
} from 'lucide-react';

export const Checkout = () => {
  const { cartItems, totalAmount, totalItemsCount, createOrder, showToast, appliedCoupon } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coepId: '',
    department: 'Computer Engineering',
    deliveryType: 'delivery',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const deliveryFee = 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, totalAmount - discount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill all required fields correctly', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder(formData, deliveryFee, discount);
      showToast('Order created! Proceed to Pay Now', 'cart');
      navigate(`/payment/${order.orderId}`);
    } catch (err) {
      console.error(err);
      showToast('Error creating order. Please try again.', 'info');
      setIsSubmitting(false);
    }
  };

  const departmentList = [
    'Computer Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics & Telecommunication',
    'Instrumentation & Control',
    'Metallurgy & Materials Science',
    'Manufacturing Science & Engineering',
    'Applied Science & Mathematics',
    'Faculty / Staff / Administration',
    'COEP Alumni',
    'Visitor / Other'
  ];

  return (
    <div className="checkout-page-wrapper">
      <Navbar />

      <main className="checkout-main-content">
        <div className="checkout-container">

          {/* Breadcrumbs */}
          <nav className="checkout-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/cart" className="breadcrumb-link">Cart</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Checkout</span>
          </nav>

          {/* Checkout Header */}
          <div className="checkout-header">
            <h1 className="checkout-main-title">Checkout</h1>
            <p className="checkout-subtitle">Enter your delivery details to proceed to secure Pay Now payment.</p>
          </div>

          <form onSubmit={handleSubmit} className="checkout-layout-grid">

            {/* Left Column: Customer & Shipping Details */}
            <div className="checkout-details-column">

              {/* Section 1: Personal Details */}
              <div className="checkout-card-section">
                <div className="section-card-title">
                  <span className="section-step-num">1</span>
                  <h3>Customer Information</h3>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                      Full Name <span className="req-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Siddhesh Chitkeshiwar"
                        className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address <span className="req-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. student@coep.ac.in"
                        className={`form-input ${errors.email ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Mobile Number <span className="req-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="coepId">
                      COEP MIS ID / Roll No. (Optional)
                    </label>
                    <div className="input-with-icon">
                      <Building size={16} className="input-icon" />
                      <input
                        type="text"
                        id="coepId"
                        name="coepId"
                        value={formData.coepId}
                        onChange={handleInputChange}
                        placeholder="e.g. 112203045"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">
                    Department / Community
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {departmentList.map((dept, i) => (
                      <option key={i} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 2: Delivery Address Details */}
              <div className="checkout-card-section">
                <div className="section-card-title">
                  <span className="section-step-num">2</span>
                  <h3>Delivery Address & Notes</h3>
                </div>

                {/* Address & Delivery Notes */}
                <div className="address-fields-group">
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">
                      Hostel Room / Department / Delivery Address (Optional)
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Hostel Block B, Room 204 or Home Delivery Address"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pincode">
                        Pincode {formData.deliveryType === 'delivery' && <span className="req-star">*</span>}
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`form-input ${errors.pincode ? 'has-error' : ''}`}
                      />
                      {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Order Summary & Action */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-card">

                <h3 className="summary-title">Order Summary</h3>

                {/* Compact Items List */}
                <div className="checkout-items-list">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="checkout-item-row">
                      <div className="checkout-item-thumb">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          productId={product.id}
                          category={product.category}
                        />
                      </div>
                      <div className="checkout-item-info">
                        <h4 className="checkout-item-name">{product.name}</h4>
                        <span className="checkout-item-qty">Qty: {quantity} × {formatCurrency(product.price)}</span>
                      </div>
                      <span className="checkout-item-total">
                        {formatCurrency(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                {/* Price Calculation Rows */}
                <div className="summary-rows-group">
                  <div className="summary-row">
                    <span className="summary-label">Subtotal ({totalItemsCount} items)</span>
                    <span className="summary-val">{formatCurrency(totalAmount)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row discount-row">
                      <span className="summary-label text-green-600 font-semibold">
                        Coupon ({appliedCoupon?.code || 'FIRST100'})
                      </span>
                      <span className="summary-val text-green-600 font-bold">
                        - {formatCurrency(discount)}
                      </span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span className="summary-label">Delivery Charge</span>
                    <span className="summary-val text-emerald-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="summary-divider"></div>

                {/* Total */}
                <div className="summary-total-row">
                  <span className="total-title">Total Payable</span>
                  <span className="total-amount">{formatCurrency(grandTotal)}</span>
                </div>

                {/* Submit / Proceed to Pay Now Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary checkout-submit-btn w-full"
                >
                  <Lock size={18} />
                  <span>Proceed to Pay Now ({formatCurrency(grandTotal)})</span>
                  <ArrowRight size={18} />
                </button>

                <p className="checkout-redirect-note">
                  <Lock size={13} /> Secure checkout with UPI, Credit/Debit Cards, Net Banking & Wallets.
                </p>

                <div className="checkout-trust-badge-row">
                  <div className="checkout-trust-badge">
                    <Zap size={14} className="text-royal-blue" />
                    <span>Instant Pay Now</span>
                  </div>
                  <div className="checkout-trust-badge">
                    <CreditCard size={14} className="text-bright-blue" />
                    <span>UPI & Cards</span>
                  </div>
                  <div className="checkout-trust-badge">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>COEP Official</span>
                  </div>
                </div>

              </div>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
