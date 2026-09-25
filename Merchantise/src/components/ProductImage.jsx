import React, { useState } from 'react';
import { Box } from 'lucide-react';

export const ProductImage = ({ src, alt, productId, category, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  // Fallback vector icon representation tailored per product ID
  const renderFallbackIllustration = () => {
    switch (productId) {
      case 'pen':
      case 'pen-silver':
      case 'pen-black':
      case 'pen-navy':
      case 'pen-rosegold':
      case 'pen-ergonomic':
        return (
          <div className="product-vector-bg bg-navy-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <path d="M 25 75 L 70 30 L 75 35 L 30 80 Z" fill="#C8A45D" />
              <path d="M 70 30 L 80 20 C 82 18 85 18 87 20 C 89 22 89 25 87 27 L 77 37 Z" fill="#2563EB" />
              <circle cx="20" cy="85" r="3" fill="#1557B0" />
            </svg>
            <span className="vector-badge">COEP PEN</span>
          </div>
        );
      case 'keychain':
        return (
          <div className="product-vector-bg bg-gold-accent">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <circle cx="50" cy="35" r="18" fill="none" stroke="#0B1F3A" strokeWidth="6" />
              <rect x="44" y="53" width="12" height="30" rx="3" fill="#1557B0" />
              <circle cx="50" cy="70" r="5" fill="#C8A45D" />
            </svg>
            <span className="vector-badge">COEP KEYCHAIN</span>
          </div>
        );
      case 'pouch':
        return (
          <div className="product-vector-bg bg-navy-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="15" y="30" width="70" height="45" rx="8" fill="#1557B0" />
              <line x1="15" y1="42" x2="85" y2="42" stroke="#0B1F3A" strokeWidth="4" />
              <circle cx="80" cy="42" r="4" fill="#C8A45D" />
              <text x="50" y="62" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">COEP</text>
            </svg>
            <span className="vector-badge">COEP POUCH</span>
          </div>
        );
      case 'diary':
      case 'diary-1854':
        return (
          <div className="product-vector-bg bg-blue-deep">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="25" y="18" width="54" height="68" rx="4" fill="#0B1F3A" stroke="#C8A45D" strokeWidth="2" />
              <line x1="33" y1="18" x2="33" y2="86" stroke="#C8A45D" strokeWidth="3" />
              <text x="53" y="48" fontSize="8" fontWeight="bold" fill="#C8A45D" textAnchor="middle">Ideas Build</text>
              <text x="53" y="58" fontSize="8" fontWeight="bold" fill="#C8A45D" textAnchor="middle">Tomorrow</text>
            </svg>
            <span className="vector-badge">COEP DIARY</span>
          </div>
        );
      case 'premium-diary':
        return (
          <div className="product-vector-bg bg-blue-deep">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="25" y="16" width="54" height="70" rx="5" fill="#0B1F3A" stroke="#C8A45D" strokeWidth="3" />
              <line x1="33" y1="16" x2="33" y2="86" stroke="#C8A45D" strokeWidth="3" />
              <rect x="42" y="32" width="28" height="38" rx="2" fill="none" stroke="#C8A45D" strokeWidth="1.5" />
              <text x="56" y="52" fontSize="8" fontWeight="bold" fill="#C8A45D" textAnchor="middle">COEP</text>
              <text x="56" y="62" fontSize="6" fill="#C8A45D" textAnchor="middle">HERITAGE</text>
            </svg>
            <span className="vector-badge">PREMIUM DIARY</span>
          </div>
        );
      case 'bottle':
        return (
          <div className="product-vector-bg bg-soft-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="40" y="15" width="20" height="10" rx="2" fill="#0B1F3A" />
              <rect x="35" y="25" width="30" height="62" rx="10" fill="#1557B0" />
              <text x="50" y="58" fontSize="9" fontWeight="bold" fill="#FFFFFF" letterSpacing="1" textAnchor="middle">COEP</text>
            </svg>
            <span className="vector-badge">COEP BOTTLE</span>
          </div>
        );
      case 'phone-cover':
        return (
          <div className="product-vector-bg bg-navy-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="30" y="16" width="40" height="68" rx="8" fill="#0B1F3A" stroke="#2563EB" strokeWidth="2" />
              <rect x="35" y="22" width="16" height="20" rx="4" fill="#1557B0" />
              <circle cx="43" cy="28" r="3" fill="#0B1F3A" />
              <circle cx="43" cy="36" r="3" fill="#0B1F3A" />
              <text x="50" y="64" fontSize="8" fontWeight="bold" fill="#C8A45D" textAnchor="middle">COEP</text>
            </svg>
            <span className="vector-badge">PHONE COVER</span>
          </div>
        );
      case 'drafter':
        return (
          <div className="product-vector-bg bg-soft-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <path d="M 25 80 L 75 80 L 50 30 Z" fill="none" stroke="#1557B0" strokeWidth="4" />
              <line x1="38" y1="65" x2="62" y2="65" stroke="#C8A45D" strokeWidth="2" />
              <circle cx="50" cy="55" r="6" fill="#0B1F3A" />
            </svg>
            <span className="vector-badge">DRAFTER</span>
          </div>
        );
      case 'calculator':
        return (
          <div className="product-vector-bg bg-navy-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="28" y="18" width="44" height="66" rx="6" fill="#0B1F3A" stroke="#C8A45D" strokeWidth="2" />
              <rect x="34" y="24" width="32" height="16" rx="2" fill="#2563EB" />
              <circle cx="38" cy="50" r="3" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
              <circle cx="62" cy="50" r="3" fill="#FFFFFF" />
              <circle cx="38" cy="62" r="3" fill="#FFFFFF" />
              <circle cx="50" cy="62" r="3" fill="#FFFFFF" />
              <circle cx="62" cy="62" r="3" fill="#FFFFFF" />
              <circle cx="38" cy="74" r="3" fill="#C8A45D" />
              <circle cx="50" cy="74" r="3" fill="#C8A45D" />
              <circle cx="62" cy="74" r="3" fill="#C8A45D" />
            </svg>
            <span className="vector-badge">CALCULATOR</span>
          </div>
        );
      case 'umbrella':
        return (
          <div className="product-vector-bg bg-navy-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <path d="M 20 50 Q 50 15 80 50 Z" fill="#0B1F3A" stroke="#2563EB" strokeWidth="2" />
              <line x1="50" y1="50" x2="50" y2="80" stroke="#C8A45D" strokeWidth="4" />
              <path d="M 50 80 Q 42 85 45 90" fill="none" stroke="#C8A45D" strokeWidth="3" />
            </svg>
            <span className="vector-badge">COEP UMBRELLA</span>
          </div>
        );
      case 'gift-set':
        return (
          <div className="product-vector-bg bg-gold-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="20" y="30" width="60" height="45" rx="4" fill="#0B1F3A" stroke="#C8A45D" strokeWidth="3" />
              <line x1="50" y1="30" x2="50" y2="75" stroke="#C8A45D" strokeWidth="5" />
              <line x1="20" y1="52" x2="80" y2="52" stroke="#C8A45D" strokeWidth="5" />
              <circle cx="50" cy="30" r="7" fill="#2563EB" />
            </svg>
            <span className="vector-badge">COMBO PACK</span>
          </div>
        );
      case 'exam-pad':
        return (
          <div className="product-vector-bg bg-soft-gradient">
            <svg viewBox="0 0 100 100" className="vector-svg">
              <rect x="26" y="20" width="48" height="66" rx="4" fill="#F1F5F9" stroke="#0B1F3A" strokeWidth="2" />
              <rect x="40" y="16" width="20" height="8" rx="2" fill="#C8A45D" />
              <line x1="34" y1="35" x2="66" y2="35" stroke="#94A3B8" strokeWidth="2" />
              <line x1="34" y1="45" x2="66" y2="45" stroke="#94A3B8" strokeWidth="2" />
              <line x1="34" y1="55" x2="66" y2="55" stroke="#94A3B8" strokeWidth="2" />
              <text x="50" y="74" fontSize="7" fontWeight="bold" fill="#0B1F3A" textAnchor="middle">COEP</text>
            </svg>
            <span className="vector-badge">EXAM PAD</span>
          </div>
        );
      default:
        return (
          <div className="product-vector-bg bg-default">
            <div className="fallback-icon-wrap">
              <Box className="w-10 h-10 text-royal-blue" />
            </div>
            <span className="vector-badge">{alt || 'COEP MERCH'}</span>
          </div>
        );
    }
  };

  if (hasError || !src) {
    return (
      <div className={`product-img-container ${className}`}>
        {renderFallbackIllustration()}
      </div>
    );
  }

  return (
    <div className={`product-img-container ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className="product-actual-img"
        loading="lazy"
      />
    </div>
  );
};
