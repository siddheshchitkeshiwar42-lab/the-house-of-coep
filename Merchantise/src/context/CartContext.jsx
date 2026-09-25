import React, { createContext, useContext, useState, useEffect } from 'react';
import { PAYMENT_CONFIG } from '../config/paymentConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_merch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_merch_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_merch_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_current_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState(null);

  // First 100 Students Coupon Usage Tracker (Limit: 100 buyers, Discount: ₹10)
  const [couponUsageCount, setCouponUsageCount] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_coupon_first100_uses');
      return saved ? parseInt(saved, 10) : 18; // 18 spots already claimed
    } catch (e) {
      return 18;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('coep_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('coep_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('coep_applied_coupon');
      }
    } catch (e) {
      console.error('Failed to persist applied coupon', e);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    try {
      localStorage.setItem('coep_coupon_first100_uses', couponUsageCount.toString());
    } catch (e) {
      console.error('Failed to persist coupon usage', e);
    }
  }, [couponUsageCount]);

  useEffect(() => {
    try {
      localStorage.setItem('coep_merch_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('coep_merch_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('coep_merch_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem('coep_current_order', JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem('coep_current_order');
      }
    } catch (e) {
      console.error('Failed to persist current order', e);
    }
  }, [currentOrder]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} × ${product.name} to cart`, 'cart');
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast(`Item removed from cart`, 'info');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist', 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Apply Coupon with 100 students limit and ₹10 reduction
  const applyCoupon = (rawCode) => {
    const code = (rawCode || '').trim().toUpperCase();

    if (!code) {
      showToast('Please enter a coupon code', 'info');
      return { success: false, message: 'Please enter a coupon code' };
    }

    if (totalAmount <= 0) {
      showToast('Cart is empty. Add products to apply coupon.', 'info');
      return { success: false, message: 'Cart is empty' };
    }

    // First 100 Students Offer (Code: FIRST100, COEP10, STUDENT100, WELCOME10)
    if (code === 'FIRST100' || code === 'COEP10' || code === 'STUDENT100' || code === 'WELCOME10') {
      const maxSpots = 100;
      if (couponUsageCount >= maxSpots) {
        showToast('Sorry! The FIRST100 coupon was limited to the first 100 students and has expired.', 'info');
        return { success: false, message: 'Coupon limit reached (100/100 claimed)' };
      }

      const discountAmount = Math.min(10, totalAmount);
      const remainingSpots = maxSpots - couponUsageCount;

      const couponObj = {
        code: 'FIRST100',
        discount: discountAmount,
        type: 'flat',
        label: 'First 100 Students ₹10 Off',
        remainingSpots
      };

      setAppliedCoupon(couponObj);
      showToast(`🎉 Flat ₹10 Student Discount Applied! (${remainingSpots} spots left)`, 'cart');
      return { success: true, message: `Flat ₹10 discount applied (${remainingSpots} spots left)` };
    }

    // Free Shipping code
    if (code === 'FREESHIP') {
      const couponObj = {
        code: 'FREESHIP',
        discount: 50,
        type: 'shipping',
        label: 'Free Delivery Discount'
      };
      setAppliedCoupon(couponObj);
      showToast('Free Shipping Discount Applied!', 'cart');
      return { success: true, message: 'Free Shipping applied' };
    }

    showToast('Invalid coupon code. Try "FIRST100"', 'info');
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Generate order from current cart state and customer details
  const createOrder = (customerDetails, shippingFee = 0, customDiscount = null) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `COEP-2026-${randomNum}`;
    const subtotal = totalAmount;
    const discount = customDiscount !== null ? customDiscount : (appliedCoupon ? appliedCoupon.discount : 0);
    const finalTotal = Math.max(0, subtotal + shippingFee - discount);
    
    const newOrder = {
      orderId,
      items: [...cartItems],
      customer: { ...customerDetails },
      subtotal,
      shippingFee,
      discount,
      appliedCoupon: appliedCoupon ? { ...appliedCoupon } : null,
      totalAmount: finalTotal,
      status: 'PAYMENT_PENDING',
      createdAt: new Date().toISOString(),
      formattedDate: new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date())
    };

    setCurrentOrder(newOrder);
    return newOrder;
  };

  // Automated Google Sheets Order Submission Handler
  const sendOrderToGoogleSheet = async (orderData) => {
    try {
      const googleScriptUrl = 
        PAYMENT_CONFIG.GOOGLE_SHEETS_URL ||
        localStorage.getItem('coep_google_sheets_url') || 
        window.GOOGLE_SHEETS_URL;

      const itemsSummary = (orderData.items || []).map(i => `${i.product.name} (Qty: ${i.quantity})`).join(', ');

      const customer = orderData.customer || {};
      const payload = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        orderId: orderData.orderId || '',
        fullName: customer.fullName || customer.name || 'COEP Customer',
        customerName: customer.fullName || customer.name || 'COEP Customer',
        email: customer.email || 'N/A',
        mobile: customer.phone || customer.mobile || 'N/A',
        phone: customer.phone || customer.mobile || 'N/A',
        coepId: customer.coepId || 'N/A',
        department: customer.department || 'N/A',
        deliveryType: customer.deliveryType || 'delivery',
        hostelNote: customer.address || customer.notes || customer.hostelNote || 'COEP Campus',
        address: customer.address || customer.notes || 'COEP Campus',
        city: customer.city || 'Pune',
        state: customer.state || 'Maharashtra',
        pincode: customer.pincode || '411005',
        products: itemsSummary || 'COEP Merchandise Item',
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        couponCode: orderData.appliedCoupon?.code || 'NONE',
        deliveryCharge: orderData.shippingFee || 0,
        totalAmount: orderData.totalAmount || 0,
        paymentStatus: 'PAID',
        transactionId: orderData.paymentRef || 'N/A',
        orderStatus: 'New',
        upiId: PAYMENT_CONFIG.UPI_ID
      };

      console.log('🚀 Automated Google Sheet Submission Payload:', payload);

      if (googleScriptUrl) {
        await fetch(googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      }
      return true;
    } catch (err) {
      console.warn('Google Sheet auto-submit warning:', err);
      return false;
    }
  };

  // Mark order as paid / verified and move to history + trigger Google Sheet auto-submit + increment coupon usage
  const confirmOrderPayment = (orderId, paymentRef = '', paymentStatus = 'PAID - Verified', meta = {}) => {
    const updated = {
      ...(currentOrder || {}),
      orderId: orderId || currentOrder?.orderId,
      status: paymentStatus || 'PAID - Verified',
      paymentStatus: paymentStatus || 'PAID - Verified',
      paymentRef: paymentRef || `PAY-${Date.now().toString().slice(-8)}`,
      paymentGateway: meta.gateway || PAYMENT_CONFIG.GATEWAY_NAME,
      paymentMethod: meta.method || 'PAY_NOW_GATEWAY',
      paidAt: new Date().toISOString(),
      googleSheetSubmitted: true
    };

    // Increment coupon count if FIRST100 was used
    if (updated.appliedCoupon && (updated.appliedCoupon.code === 'FIRST100' || updated.appliedCoupon.code === 'COEP10')) {
      setCouponUsageCount(prev => prev + 1);
    }

    setCurrentOrder(updated);
    setOrders(prev => [updated, ...prev.filter(o => o.orderId !== updated.orderId)]);
    clearCart();
    setAppliedCoupon(null);
    sendOrderToGoogleSheet(updated);
    return updated;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemsCount,
      totalAmount,
      wishlist,
      toggleWishlist,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      toast,
      showToast,
      currentOrder,
      setCurrentOrder,
      orders,
      createOrder,
      confirmOrderPayment,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      couponUsageCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
