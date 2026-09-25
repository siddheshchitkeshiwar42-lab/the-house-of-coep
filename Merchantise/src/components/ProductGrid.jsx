import React from 'react';
import { products, categories } from '../data/products';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { SearchX, FilterX } from 'lucide-react';

export const ProductGrid = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useCart();

  const getCategoryTitle = () => {
    if (selectedCategory === 'All') return 'Featured Products';
    const found = categories.find(c => c.id === selectedCategory);
    if (found) return `${found.name} Collection`;
    for (const cat of categories) {
      if (cat.items) {
        const sub = cat.items.find(item => item.id === selectedCategory);
        if (sub) return `${sub.name} Collection`;
      }
    }
    const prod = products.find(p => p.id === selectedCategory);
    if (prod) return `${prod.name} Collection`;
    return `${selectedCategory} Collection`;
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory ||
      product.id === selectedCategory ||
      ((selectedCategory === 'pens' || selectedCategory === 'pen') && product.id.startsWith('pen'));

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="featured-products-section" className="products-grid-section">
      <div className="section-header grid-header">
        <div>
          <span className="section-eyebrow">EXPLORE MERCHANDISE</span>
          <h2 className="section-title">
            {getCategoryTitle()}
          </h2>
          <p className="section-sub-text">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
        </div>

        {(searchQuery || selectedCategory !== 'All') && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <FilterX size={16} /> Reset Filters
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-products-state">
          <SearchX size={48} className="empty-icon" />
          <h3>No Merchandise Found</h3>
          <p>We couldn't find any products matching your query "{searchQuery}".</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            View All Products
          </button>
        </div>
      )}
    </section>
  );
};
