import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { OrderSuccess } from './pages/OrderSuccess';
import { CheckCircle2, Heart, Info } from 'lucide-react';
import './index.css';

// Toast Notification Banner Component
const ToastNotification = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast-box">
        {toast.type === 'cart' && <CheckCircle2 size={18} className="text-green-400" />}
        {toast.type === 'wishlist' && <Heart size={18} className="text-red-400 fill-current" />}
        {toast.type === 'info' && <Info size={18} className="text-blue-400" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <ToastNotification />
      </Router>
    </CartProvider>
  );
}

export default App;
