import React, { useState } from 'react';
import { ArrowRight, Award, Users, Leaf, Sparkles, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductGrid } from '../components/ProductGrid';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const { setSelectedCategory } = useCart();
  const [heroImageError, setHeroImageError] = useState(false);

  const handleShopNowClick = () => {
    const el = document.getElementById('featured-products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="main-content">
        {/* HERO SECTION - "CARRY THE LEGACY" */}
        <section className="hero-section">
          {/* Ambient Lighting & Decorative Glows */}
          <div className="hero-bg-glow hero-bg-glow-1"></div>
          <div className="hero-bg-glow hero-bg-glow-2"></div>
          <div className="hero-bg-abstract-curve"></div>

          <div className="hero-container">
            {/* 1. Header Text Box (Eyebrow + Title + Subtitle) */}
            <div className="hero-header-box">
              {/* Eyebrow */}
              <div className="hero-eyebrow">
                <span className="eyebrow-dot"></span>
                <span>IDEAS</span>
                <span className="eyebrow-sep">|</span>
                <span>PEOPLE</span>
                <span className="eyebrow-sep">|</span>
                <span>IMPACT</span>
              </div>

              {/* Display Headline */}
              <h1 className="hero-serif-headline">
                Carry<br />
                The <span className="hero-headline-accent">Legacy.</span>
              </h1>

              {/* Subtitle */}
              <p className="hero-description">
                Official merchandise for the COEP community.<br />
                Small items. A bigger purpose.
              </p>
            </div>

            {/* 2. Hero Visual Showcase Stage (Image - Placed immediately below heading) */}
            <div className="hero-showcase-stage">
              {/* Top-Right Floating Handwritten Note */}
              <div className="hero-handwritten-badge">
                <div className="handwritten-text">
                  Ideas<br />
                  Build<br />
                  Tomorrow
                </div>
                <svg className="handwritten-curve-line" viewBox="0 0 100 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 11C30 16 65 3 96 9" stroke="#C8A45D" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Far-Right Vertical Tagline Pillar */}
              <div className="hero-vertical-tagline">
                <span className="vertical-word">STUDY</span>
                <span className="vertical-word">CREATE</span>
                <span className="vertical-word">LEAD</span>
                <span className="vertical-word">BELONG</span>
                <div className="vertical-accent-line"></div>
              </div>

              {/* Main Merchandise Composite Image Frame */}
              <div className="hero-image-stage-wrap">
                <div className="hero-image-backdrop-glow"></div>
                {!heroImageError ? (
                  <img
                    src="/coepcombine.png"
                    alt="COEP Official Merchandise Collection - Water Bottle, Diary, Pouch, Keychain, Pen, Exam Pad"
                    className="hero-composite-photo"
                    onError={() => setHeroImageError(true)}
                  />
                ) : (
                  <div className="hero-composition-fallback">
                    <img
                      src="/image.png"
                      alt="The House of COEP"
                      className="hero-fallback-emblem"
                    />
                    <span className="fallback-tag">OFFICIAL MERCHANDISE</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Action Buttons Row */}
            <div className="hero-action-row">
              <button
                type="button"
                className="hero-shop-pill-btn"
                onClick={handleShopNowClick}
                id="hero-shop-now-btn"
              >
                <span>Shop Now</span>
                <ArrowRight size={18} className="hero-btn-arrow" />
              </button>

              <button
                type="button"
                className="hero-explore-pill-btn"
                onClick={handleExploreClick}
              >
                <span>Explore Catalog</span>
              </button>
            </div>

            {/* 4. 3 Core Value Pillars in a Refined Card Container */}
            <div className="hero-value-props-strip">
              <div className="value-prop-card" onClick={handleShopNowClick}>
                <div className="value-prop-icon-circle">
                  <Award size={19} className="value-icon" />
                </div>
                <div className="value-prop-text">
                  <span className="value-prop-title">Quality</span>
                  <span className="value-prop-sub">Merchandise</span>
                </div>
              </div>

              <div className="value-prop-card" onClick={handleShopNowClick}>
                <div className="value-prop-icon-circle">
                  <Users size={19} className="value-icon" />
                </div>
                <div className="value-prop-text">
                  <span className="value-prop-title">Support</span>
                  <span className="value-prop-sub">Student Initiatives</span>
                </div>
              </div>

              <div className="value-prop-card" onClick={handleShopNowClick}>
                <div className="value-prop-icon-circle">
                  <Leaf size={19} className="value-icon" />
                </div>
                <div className="value-prop-text">
                  <span className="value-prop-title">Be a Part</span>
                  <span className="value-prop-sub">of Something Bigger</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER & CARDS */}
        <CategoryFilter />

        {/* FEATURED PRODUCTS GRID */}
        <ProductGrid />

        {/* PROMOTIONAL BANNER SECTION */}
        <section className="promo-banner-section">
          <div className="promo-banner-card">
            {/* Ambient Background Glows */}
            <div className="promo-bg-radial"></div>
            <div className="promo-bg-grid-pattern"></div>

            <div className="promo-grid-layout">
              {/* Left Column: Text & CTAs */}
              <div className="promo-content">
                <div className="promo-eyebrow-wrap">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="promo-eyebrow">LIMITED EDITION MERCHANDISE</span>
                </div>

                <h2 className="promo-headline">
                  CARRY THE LEGACY
                </h2>

                <p className="promo-subtext">
                  Not just merchandise. A piece of COEP with you. Crafted with precision for students, faculty, and alumni across the globe.
                </p>

                <div className="promo-actions">
                  <button
                    type="button"
                    className="promo-btn-gold"
                    onClick={() => {
                      setSelectedCategory('Premium');
                      handleShopNowClick();
                    }}
                  >
                    <span>Explore Premium Collection</span>
                    <ArrowRight size={18} className="promo-btn-icon" />
                  </button>
                </div>

                {/* Feature Pills */}
                <div className="promo-feature-pills">
                  <span className="promo-pill">
                    <Star size={13} className="text-amber-400 fill-amber-400" /> Official COEP Crest
                  </span>
                  <span className="promo-pill">
                    <Award size={13} className="text-amber-400" /> Premium Quality
                  </span>
                  <span className="promo-pill">
                    <Leaf size={13} className="text-emerald-400" /> Student Supported
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Stage & Product Showcase */}
              <div className="promo-visual-stage">
                <div className="promo-image-frame">
                  <img
                    src="/combinecoep.png"
                    alt="COEP Premium Merchandise Showcase"
                    className="promo-merch-img"
                  />
                  <div className="promo-badge-floating">
                    <span className="floating-badge-title">COEP Store 2026</span>
                    <span className="floating-badge-sub">Limited Batch Edition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
