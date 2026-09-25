import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="site-footer-wrapper">
      <div className="site-footer-container">
        {/* Main Content Grid with Vertical Dividers */}
        <div className="site-footer-main-row">
          
          {/* 1. Left Brand & Motto */}
          <div className="footer-brand-section">
            <Link to="/" className="footer-brand-logo-link">
              <div className="footer-brand-emblem">
                <img src="/image.png" alt="The House of COEP" className="footer-logo-img" />
              </div>
              <div className="footer-brand-titles">
                <span className="brand-name-main">COEP</span>
                <span className="brand-name-sub">MERCH STORE</span>
              </div>
            </Link>
            <p className="footer-brand-motto">Wear Ideas. Build Tomorrow.</p>
          </div>

          {/* Vertical Divider */}
          <div className="footer-vertical-divider"></div>

          {/* 2. Middle-Left Quick Links */}
          <div className="footer-links-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/shop">Collections</Link></li>
              <li><Link to="/">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* 3. Middle-Right Follow Us */}
          <div className="footer-social-section">
            <h4 className="footer-section-title">Follow Us</h4>
            <div className="footer-social-icons-row">
              {/* Instagram */}
              <a href="https://www.instagram.com/the_house_of_coep1854?stkn=YXE5a2Nyd2U4endm" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-link-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-link-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="social-link-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="footer-vertical-divider"></div>

          {/* 4. Right Handwritten Badge */}
          <div className="footer-badge-section">
            <div className="footer-handwritten-wrap">
              <span className="handwritten-badge-line">Ideas</span>
              <span className="handwritten-badge-line">Build</span>
              <span className="handwritten-badge-line">Tomorrow</span>
              <svg className="footer-badge-curve" viewBox="0 0 100 12" fill="none">
                <path d="M4 8C30 12 70 2 96 6" stroke="#C8A45D" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="site-footer-bottom-bar">
          <p className="footer-copyright-text">
            © 2026 COEP Merchandise Store. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <Link to="/#privacy">Privacy Policy</Link>
            <span className="legal-sep">|</span>
            <Link to="/#terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
