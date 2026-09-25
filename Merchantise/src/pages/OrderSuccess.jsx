import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductImage } from '../components/ProductImage';
import { formatCurrency } from '../utils/formatCurrency';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ArrowRight,
  Printer,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

export const OrderSuccess = () => {
  const { orderId } = useParams();
  const { currentOrder, orders } = useCart();

  // Look up order in context or recent history
  const order = currentOrder || orders.find(o => o.orderId === orderId) || {
    orderId: orderId || 'COEP-2026-00123',
    totalAmount: 898,
    subtotal: 898,
    shippingFee: 0,
    formattedDate: new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date()),
    customer: {
      fullName: 'COEP Student / Alumni',
      email: 'student@coep.ac.in',
      phone: '9876543210',
      department: 'Computer Engineering',
      deliveryType: 'delivery',
      address: 'Hostel Block B, COEP Campus'
    },
    items: [],
    status: 'PAID_VERIFICATION_PENDING'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="order-success-page-wrapper">
      <Navbar />

      <main className="order-success-main">
        <div className="order-success-container">
          
          {/* Top Success Banner */}
          <div className="success-hero-banner">
            <div className="success-icon-badge">
              <CheckCircle2 size={54} className="text-green-600" />
            </div>
            <h1 className="success-headline">Order Placed Successfully!</h1>
            <p className="success-subtext">
              Thank you for supporting student initiatives & carrying the COEP legacy.
            </p>
          </div>

          {/* Receipt / Order Details Card */}
          <div className="order-receipt-card" id="printable-receipt">
            
            <div className="receipt-card-header">
              <div>
                <span className="receipt-tag">OFFICIAL RECEIPT</span>
                <h2 className="receipt-title">Order Summary & Confirmation</h2>
              </div>
              <button
                type="button"
                className="print-receipt-btn"
                onClick={handlePrint}
                title="Print Receipt"
              >
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Key Metadata Table */}
            <div className="receipt-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Order Reference ID</span>
                <span className="meta-val font-mono text-royal-blue font-bold">{order.orderId}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Date & Time</span>
                <span className="meta-val">{order.formattedDate}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Total Amount</span>
                <span className="meta-val font-bold text-bright-blue text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Payment Status</span>
                <span className={`payment-status-badge ${order.paymentStatus?.includes('Verified') || order.status?.includes('Verified') ? 'verified bg-emerald-50 text-emerald-700 border-emerald-200' : 'pending bg-amber-50 text-amber-700 border-amber-200'} px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border`}>
                  <span className={`w-2 h-2 rounded-full ${order.paymentStatus?.includes('Verified') || order.status?.includes('Verified') ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{order.paymentStatus || order.status || 'Verified & Paid'}</span>
                </span>
              </div>
              {order.paymentRef && (
                <div className="meta-item">
                  <span className="meta-label">Transaction Ref / ID</span>
                  <span className="meta-val font-mono text-xs font-semibold text-slate-700">{order.paymentRef}</span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="meta-item">
                  <span className="meta-label">Payment Mode</span>
                  <span className="meta-val font-semibold text-xs text-royal-blue">{order.paymentMethod}</span>
                </div>
              )}
            </div>

            <div className="receipt-divider"></div>

            {/* Customer & Delivery Information */}
            <div className="receipt-customer-details">
              <div className="customer-info-box">
                <h4 className="box-title flex items-center gap-2">
                  <User size={16} className="text-royal-blue" />
                  Customer Details
                </h4>
                <p><strong>Name:</strong> {order.customer?.fullName || 'COEP Customer'}</p>
                <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
                {order.customer?.coepId && <p><strong>COEP ID:</strong> {order.customer.coepId}</p>}
                {order.customer?.department && <p><strong>Dept:</strong> {order.customer.department}</p>}
              </div>

              <div className="customer-info-box">
                <h4 className="box-title flex items-center gap-2">
                  <MapPin size={16} className="text-royal-blue" />
                  Delivery Details
                </h4>
                <p>
                  <strong>Address:</strong>{' '}
                  {order.customer?.address || 'COEP Campus / Pune'}
                </p>
                <p>
                  <strong>City / State:</strong>{' '}
                  {order.customer?.city || 'Pune'}, {order.customer?.state || 'Maharashtra'} {order.customer?.pincode ? `- ${order.customer.pincode}` : ''}
                </p>
                <p><strong>Status:</strong> Dispatched to Address</p>
              </div>
            </div>

            {/* Itemized Purchased List */}
            {order.items && order.items.length > 0 && (
              <>
                <div className="receipt-divider"></div>
                <div className="receipt-items-section">
                  <h4 className="items-table-title">Merchandise Items</h4>
                  <div className="receipt-items-table">
                    {order.items.map(({ product, quantity }) => (
                      <div key={product.id} className="receipt-item-row">
                        <div className="receipt-item-left">
                          <div className="receipt-item-thumb">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              productId={product.id}
                              category={product.category}
                            />
                          </div>
                          <div>
                            <span className="receipt-item-name">{product.name}</span>
                            <span className="receipt-item-cat">{product.category}</span>
                          </div>
                        </div>
                        <div className="receipt-item-qty">Qty: {quantity}</div>
                        <div className="receipt-item-price font-bold">
                          {formatCurrency(product.price * quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Bottom Note */}
            <div className="receipt-footer-note">
              <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 mb-1">
                  ✓ Order Form Automatically Submitted to Google Sheets Ledger
                </p>
                <p className="text-xs text-slate-600">
                  Payment confirmed to UPI ID <code className="font-mono text-royal-blue bg-blue-50 px-1 py-0.5 rounded">{PAYMENT_CONFIG.UPI_ID}</code>. Order reference logged. You will receive collection details via email/SMS or inside our <a href={PAYMENT_CONFIG.WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold underline hover:text-emerald-700">Official WhatsApp Group</a>.
                </p>
              </div>
            </div>

          </div>

          {/* WhatsApp Buyers Community Banner */}
          <div className="whatsapp-community-card">
            <div className="whatsapp-card-content">
              <div className="whatsapp-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.808 0-3.573-.484-5.118-1.401l-.367-.22-3.805.998 1.015-3.71-.241-.383A9.972 9.972 0 012.05 12.05C2.05 6.55 6.536 2.064 12.037 2.064c2.66 0 5.162 1.037 7.042 2.918 1.879 1.88 2.915 4.381 2.915 7.042 0 5.5-4.486 9.986-9.943 9.986m0-18.064C6.012 3.779 1.11 8.681 1.11 14.708c0 2.116.598 4.184 1.733 5.972L1.082 26.5l5.962-1.564a10.92 10.92 0 005.893 1.701h.005c5.997 0 10.9-4.903 10.9-10.93 0-2.919-1.137-5.663-3.203-7.729-2.065-2.066-4.809-3.203-7.727-3.203" />
                </svg>
              </div>
              <div className="whatsapp-card-text">
                <div className="whatsapp-badge">OFFICIAL BUYERS COMMUNITY</div>
                <h3 className="whatsapp-card-title">Join COEP Merchandise WhatsApp Group</h3>
                <p className="whatsapp-card-subtext">
                  Get live order updates, pickup announcements, and connect with fellow COEP buyers directly on WhatsApp!
                </p>
              </div>
            </div>
            <a
              href={PAYMENT_CONFIG.WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-join-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.808 0-3.573-.484-5.118-1.401l-.367-.22-3.805.998 1.015-3.71-.241-.383A9.972 9.972 0 012.05 12.05C2.05 6.55 6.536 2.064 12.037 2.064c2.66 0 5.162 1.037 7.042 2.918 1.879 1.88 2.915 4.381 2.915 7.042 0 5.5-4.486 9.986-9.943 9.986m0-18.064C6.012 3.779 1.11 8.681 1.11 14.708c0 2.116.598 4.184 1.733 5.972L1.082 26.5l5.962-1.564a10.92 10.92 0 005.893 1.701h.005c5.997 0 10.9-4.903 10.9-10.93 0-2.919-1.137-5.663-3.203-7.729-2.065-2.066-4.809-3.203-7.727-3.203" />
              </svg>
              <span>Join WhatsApp Group</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="success-action-buttons">
            <Link to="/shop" className="btn-secondary">
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </Link>

            <Link to="/" className="btn-primary">
              <span>Back to Home</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
