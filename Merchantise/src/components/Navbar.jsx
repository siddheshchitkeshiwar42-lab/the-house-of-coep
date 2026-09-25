import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SearchBar } from './SearchBar';

export const Navbar = () => {
  const { totalItemsCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-emblem">
            <img src="/image.png" alt="The House of COEP" className="brand-logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-title">COEP</span>
            <span className="brand-subtitle">MERCH STORE</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          <Link to="/" className={`nav-link-item ${isCurrent('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link-item ${isCurrent('/shop') ? 'active' : ''}`}>
            Shop
          </Link>
          <Link to="/about" className={`nav-link-item ${isCurrent('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link-item ${isCurrent('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="navbar-search-container">
          <SearchBar />
        </div>

        {/* Right Navigation Controls */}
        <div className="navbar-actions">
          {/* Shop Link button for quick access */}
          <Link to="/shop" className="nav-icon-btn desktop-only" title="Browse Shop">
            <Store size={20} />
          </Link>

          {/* Wishlist Link / Indicator */}
          <Link 
            to="/shop" 
            className="nav-icon-btn" 
            title="Wishlist"
          >
            <Heart size={20} className={wishlist.length > 0 ? "fill-current text-red-500" : ""} />
            {wishlist.length > 0 && (
              <span className="nav-badge badge-wishlist">{wishlist.length}</span>
            )}
          </Link>

          {/* Cart Icon & Counter Badge */}
          <Link to="/cart" className="nav-cart-btn" title="View Shopping Cart">
            <div className="relative-wrap">
              <ShoppingBag size={21} />
              {totalItemsCount > 0 && (
                <span className="nav-badge badge-cart">{totalItemsCount}</span>
              )}
            </div>
            <span className="cart-text-label">Cart</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      <div className="mobile-search-bar-row">
        <SearchBar placeholder="Search COEP merchandise..." />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${isCurrent('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${isCurrent('/shop') ? 'active' : ''}`}>
              Shop / All Products
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${isCurrent('/about') ? 'active' : ''}`}>
              About Us
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${isCurrent('/contact') ? 'active' : ''}`}>
              Contact Us
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item flex-between">
              <span>Shopping Cart</span>
              <span className="badge-pill">{totalItemsCount} items</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
