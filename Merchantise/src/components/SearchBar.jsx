import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { formatCurrency } from '../utils/formatCurrency';

export const SearchBar = ({ className = '', placeholder = "Search for merchandise..." }) => {
  const { searchQuery, setSearchQuery } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Find real-time matching products
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = trimmedQuery
    ? products.filter((p) => {
        return (
          p.name.toLowerCase().includes(trimmedQuery) ||
          (p.fullName && p.fullName.toLowerCase().includes(trimmedQuery)) ||
          p.category.toLowerCase().includes(trimmedQuery) ||
          (p.tagline && p.tagline.toLowerCase().includes(trimmedQuery)) ||
          (p.description && p.description.toLowerCase().includes(trimmedQuery))
        );
      })
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle form submission (e.g. Enter key or search button)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (trimmedQuery) {
      setIsOpen(false);
      navigate('/shop');
    }
  };

  // Handle clicking on an individual search result item
  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  // Handle "View All Results" click
  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/shop');
  };

  return (
    <div className={`search-bar-outer ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="search-bar-wrapper">
        <button type="submit" className="search-submit-icon-btn" title="Search">
          <Search className="search-icon" size={18} />
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (trimmedQuery) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className="search-input"
          id="homepage-search-input"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="search-clear-btn"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Live Search Results Dropdown */}
      {isOpen && trimmedQuery && (
        <div className="search-dropdown-menu">
          {matchingProducts.length > 0 ? (
            <>
              <div className="search-dropdown-header">
                <span>Matching Merchandise ({matchingProducts.length})</span>
                <span className="search-dropdown-tip">Press Enter to view all</span>
              </div>
              <div className="search-results-list">
                {matchingProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleSelectProduct(product.id)}
                  >
                    <div className="result-img-box">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="result-thumb-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="result-info-box">
                      <div className="result-title-row">
                        <span className="result-name">{product.name}</span>
                        <span className="result-category-badge">{product.category}</span>
                      </div>
                      <div className="result-meta-row">
                        <span className="result-tagline">{product.tagline || product.categoryLabel}</span>
                        <span className="result-price">{formatCurrency(product.price)}</span>
                      </div>
                    </div>
                    <ArrowRight size={15} className="result-arrow-icon" />
                  </div>
                ))}
              </div>
              <div className="search-dropdown-footer" onClick={handleViewAll}>
                <span>View all {matchingProducts.length} results in Shop</span>
                <ArrowRight size={16} />
              </div>
            </>
          ) : (
            <div className="search-no-results">
              <Package size={28} className="no-results-icon" />
              <p className="no-results-title">No products found for "{searchQuery}"</p>
              <p className="no-results-sub">Try searching for pens, diaries, bottles, keychains, pouches, or exam pads.</p>
              <button type="button" className="no-results-btn" onClick={handleViewAll}>
                Browse Entire Shop Catalog
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
