import React from 'react';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { ArrowRight, BookOpen, Briefcase, Sparkles, Layers } from 'lucide-react';

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory } = useCart();

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'Everyday': return <BookOpen size={20} />;
      case 'Accessories': return <Briefcase size={20} />;
      case 'Premium': return <Sparkles size={20} />;
      default: return <Layers size={20} />;
    }
  };

  const categoryCards = [
    {
      id: 'Everyday',
      title: 'Everyday',
      sub: 'Stationery & Essentials',
      desc: 'Pens, diaries, pouches & exam pads for daily campus life.',
      bgClass: 'card-bg-everyday'
    },
    {
      id: 'Accessories',
      title: 'Accessories',
      sub: 'For Daily Life',
      desc: 'Stainless bottles & drafter guards built to last.',
      bgClass: 'card-bg-accessories'
    },
    {
      id: 'Premium',
      title: 'Premium',
      sub: 'For The Ones Who Go Beyond',
      desc: 'Leather diaries & executive combo packs.',
      bgClass: 'card-bg-premium'
    }
  ];

  return (
    <section id="categories-section" className="categories-section">
      <div className="section-header">
        <div className="header-text-group">
          <span className="section-eyebrow">CURATED COLLECTIONS</span>
          <h2 className="section-title">Shop by Category</h2>
        </div>

        {/* Category Pill Tabs */}
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="pill-icon">{getCategoryIcon(cat.id)}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Visual Highlight Cards */}
      <div className="category-cards-grid">
        {categoryCards.map((card) => (
          <div
            key={card.id}
            className={`category-visual-card ${card.bgClass} ${selectedCategory === card.id ? 'selected-border' : ''}`}
            onClick={() => {
              setSelectedCategory(card.id);
              const grid = document.getElementById('featured-products-section');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="cat-card-content">
              <span className="cat-sub">{card.sub}</span>
              <h3 className="cat-title">{card.title}</h3>
              <p className="cat-desc">{card.desc}</p>
              <span className="cat-action-link">
                Explore Category <ArrowRight size={16} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
