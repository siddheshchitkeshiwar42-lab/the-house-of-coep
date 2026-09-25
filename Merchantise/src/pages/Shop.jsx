import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  SearchX,
  RotateCcw,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const Shop = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useCart();

  // Local state for Shop page filters
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Compute counts per category dynamically
  const categoryStats = useMemo(() => {
    return {
      All: products.length,
      Everyday: products.filter(p => p.category === 'Everyday').length,
      Accessories: products.filter(p => p.category === 'Accessories').length,
      Premium: products.filter(p => p.category === 'Premium').length,
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter (matches main category, subcategory, or specific product ID)
        const matchesCategory =
          selectedCategory === 'All' ||
          product.category === selectedCategory ||
          product.id === selectedCategory ||
          ((selectedCategory === 'pens' || selectedCategory === 'pen') && product.id.startsWith('pen'));

        // Price filter
        const matchesPrice = product.price <= maxPrice;

        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          query === '' ||
          product.name.toLowerCase().includes(query) ||
          (product.fullName && product.fullName.toLowerCase().includes(query)) ||
          product.category.toLowerCase().includes(query) ||
          (product.tagline && product.tagline.toLowerCase().includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query));

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // default: featured
        if (a.isFeatured === b.isFeatured) return 0;
        return a.isFeatured ? -1 : 1;
      });
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  const hasActiveFilters = selectedCategory !== 'All' || maxPrice < 1500 || searchQuery.trim() !== '' || sortBy !== 'featured';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(1500);
    setSearchQuery('');
    setSortBy('featured');
  };

  const getCategoryDisplayTitle = () => {
    if (selectedCategory === 'All') return 'All Products';
    const found = categories.find(c => c.id === selectedCategory);
    if (found) return found.name;

    for (const cat of categories) {
      if (cat.items) {
        const sub = cat.items.find(item => item.id === selectedCategory);
        if (sub) return sub.name;
      }
    }

    const prod = products.find(p => p.id === selectedCategory);
    if (prod) return prod.name;

    return 'All Products';
  };

  return (
    <div className="shop-page-wrapper">
      <Navbar />

      <main className="shop-main-content">
        <div className="shop-container">

          {/* Breadcrumbs */}
          <nav className="shop-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Shop</span>
            {selectedCategory !== 'All' && (
              <>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-sub">{getCategoryDisplayTitle()}</span>
              </>
            )}
          </nav>

          {/* Shop Page Heading Header */}
          <div className="shop-header">
            <div className="shop-title-group">
              <h1 className="shop-main-title">{getCategoryDisplayTitle()}</h1>
              <p className="shop-subtitle">Find the perfect COEP merchandise.</p>
            </div>

            {/* Mobile Filter Toggle Button (Desktop hidden) */}
            <div className="shop-header-actions">
              <button
                type="button"
                className="mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter size={18} />
                <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
              </button>
            </div>
          </div>

          {/* Mobile Category Quick-Scroll Bar (Visible only on mobile/tablet) */}
          <div className="mobile-category-pills-bar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryStats[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`mobile-cat-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="pill-name">{cat.name}</span>
                  <span className="pill-count">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Control Bar: Filters + Sort + Item Count (Visible only on mobile) */}
          <div className="mobile-controls-bar">
            <button
              type="button"
              className={`mobile-control-filter-btn ${hasActiveFilters ? 'has-active' : ''}`}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {hasActiveFilters && <span className="active-dot">•</span>}
            </button>

            <div className="mobile-sort-control">
              <ArrowUpDown size={13} className="mobile-sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mobile-sort-select"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A - Z)</option>
              </select>
            </div>

            <div className="mobile-items-counter">
              <span>{filteredProducts.length} items</span>
            </div>
          </div>

          {/* Shop Layout Grid: Sidebar + Product Grid */}
          <div className="shop-layout">

            {/* Filter Sidebar / Mobile Bottom Sheet Drawer */}
            <aside className={`shop-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
              <div className="sheet-grab-bar"></div>
              <div className="sidebar-inner">
                {/* Mobile Drawer Header */}
                <div className="sidebar-mobile-header">
                  <div className="sheet-title-group">
                    <SlidersHorizontal size={18} className="text-royal-blue" />
                    <span className="sheet-title-text">Filters & Sort</span>
                  </div>
                  <button
                    type="button"
                    className="sidebar-close-btn"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Filter Section 1: Categories & Product Samples */}
                <div className="filter-group">
                  <h3 className="filter-group-title">Categories</h3>
                  <div className="filter-options-list">
                    {categories.map((cat) => {
                      const count = categoryStats[cat.id] ?? 0;
                      const isCatSelected = selectedCategory === cat.id;

                      return (
                        <div key={cat.id} className="category-group-block">
                          <label
                            className={`filter-category-item ${isCatSelected ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              if (window.innerWidth < 1024) setMobileFiltersOpen(false);
                            }}
                          >
                            <div className="filter-checkbox-wrap">
                              <input
                                type="radio"
                                name="shop-category"
                                checked={isCatSelected}
                                onChange={() => setSelectedCategory(cat.id)}
                                className="custom-radio"
                              />
                              <span className="filter-label-text">{cat.name}</span>
                            </div>
                            <span className="filter-count-badge">({count})</span>
                          </label>

                          {/* Sub-items list of product samples (Desktop view) */}
                          {cat.items && cat.items.length > 0 && (
                            <ul className="filter-subitems-list">
                              {cat.items.map((subItem) => {
                                const isSubSelected = selectedCategory === subItem.id;
                                return (
                                  <li
                                    key={subItem.id}
                                    className={`filter-subitem ${isSubSelected ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCategory(subItem.id);
                                      if (window.innerWidth < 1024) setMobileFiltersOpen(false);
                                    }}
                                  >
                                    <span className="subitem-bullet">•</span>
                                    <span className="subitem-name">{subItem.name}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Section 2: Price Range */}
                <div className="filter-group">
                  <div className="filter-title-row">
                    <h3 className="filter-group-title">Price Range</h3>
                    <span className="price-range-current">{formatCurrency(maxPrice)}</span>
                  </div>

                  <div className="price-slider-container">
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="price-range-slider"
                    />
                    <div className="price-slider-labels">
                      <span>₹0</span>
                      <span>₹1500</span>
                    </div>
                  </div>
                </div>

                {/* Filter Section 3: Sort By */}
                <div className="filter-group">
                  <h3 className="filter-group-title">Sort by</h3>
                  <div className="sort-select-wrapper">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="shop-sort-select"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Alphabetical (A - Z)</option>
                    </select>
                    <ArrowUpDown size={16} className="select-arrow-icon" />
                  </div>
                </div>

                {/* Clear / Reset Button on Desktop */}
                {hasActiveFilters && (
                  <div className="filter-actions desktop-filter-actions">
                    <button
                      type="button"
                      className="sidebar-reset-btn"
                      onClick={resetAllFilters}
                    >
                      <RotateCcw size={15} />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}

                {/* Sticky Mobile Drawer Footer */}
                <div className="mobile-drawer-sticky-footer">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="drawer-reset-btn"
                      onClick={resetAllFilters}
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="drawer-apply-btn"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span>Show {filteredProducts.length} Items</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Mobile Overlay Backdrop */}
            {mobileFiltersOpen && (
              <div
                className="shop-backdrop"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}

            {/* Right Product Grid Area */}
            <div className="shop-products-column">

              {/* Active Filter Chips / Status bar (Desktop view) */}
              <div className="shop-status-bar desktop-status-bar">
                <p className="shop-count-text">
                  Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> items
                  {selectedCategory !== 'All' && <span> in <em>{getCategoryDisplayTitle()}</em></span>}
                  {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
                  {maxPrice < 1500 && <span> under <strong>{formatCurrency(maxPrice)}</strong></span>}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="clear-all-inline-btn"
                    onClick={resetAllFilters}
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="shop-product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Empty Results State */
                <div className="shop-empty-state">
                  <div className="empty-icon-circle">
                    <SearchX size={44} className="text-royal-blue" />
                  </div>
                  <h3 className="empty-title">No merchandise found</h3>
                  <p className="empty-subtitle">
                    We couldn't find any products matching your current filters. Try changing category, adjusting price slider, or clearing search.
                  </p>
                  <button
                    type="button"
                    className="btn-primary reset-cta-btn"
                    onClick={resetAllFilters}
                  >
                    <RotateCcw size={16} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
