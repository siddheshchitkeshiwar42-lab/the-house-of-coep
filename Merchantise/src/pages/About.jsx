import React from 'react';
import { Users, Gem, Rocket, Heart, Building2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const About = () => {
  const handleScrollToStory = (e) => {
    e.preventDefault();
    const el = document.getElementById('our-story-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* 1. About Hero Section */}
        <section className="about-hero-section">
          {/* Ambient Background Organic Blobs */}
          <div className="about-bg-blob blob-1"></div>
          <div className="about-bg-blob blob-2"></div>

          <div className="about-hero-container">
            {/* 1. Header Text Box (Eyebrow + Title + Subtitle + Accent Bar) */}
            <div className="about-hero-header-box">
              <span className="about-eyebrow">ABOUT US</span>

              <h1 className="about-main-title">
                Built by Students,<br />
                for <span className="highlight-touch">COEP</span>
              </h1>

              <p className="about-hero-subtitle">
                A dedicated merchandise platform created by four student friends to celebrate the legacy, pride, and vibrant community of COEP Technological University.
              </p>

              <div className="about-accent-bar"></div>
            </div>

            {/* 2. Visual Stage with about-mainbuilding.png */}
            <div className="about-hero-visual">
              <div className="about-building-frame">
                <div className="about-frame-badge">
                  <Building2 size={15} />
                  <span>COEP Main Building • Est. 1854</span>
                </div>
                <img
                  src="/about-mainbuilding.png"
                  alt="COEP Historic Main Building Architectural Sketch"
                  className="building-sketch-img"
                />
              </div>
            </div>

            {/* 3. Value Highlight Chips */}
            <div className="about-hero-chips">
              <div className="about-hero-chip">
                <Users size={16} className="chip-icon" />
                <span>By 4 Roommates</span>
              </div>
              <div className="about-hero-chip">
                <Award size={16} className="chip-icon" />
                <span>Official Identity</span>
              </div>
              <div className="about-hero-chip">
                <Heart size={16} className="chip-icon" />
                <span>COEP Spirit</span>
              </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="about-hero-actions">
              <button 
                type="button" 
                onClick={handleScrollToStory} 
                className="about-btn-primary"
              >
                <span>Our Story</span>
                <ArrowRight size={16} />
              </button>
              <Link to="/shop" className="about-btn-secondary">
                <span>Browse Merch</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Our Story Section */}
        <section className="about-story-section" id="our-story-section">
          <div className="about-story-container">
            <span className="about-section-eyebrow">OUR STORY</span>
            <h2 className="about-section-title">More Than a Store</h2>
            <div className="about-accent-bar center-bar"></div>

            <div className="about-story-text-block">
              <p className="about-story-paragraph">
                We are four friends and roommates at COEP — Siddhesh, Tanishq, Atharva and Mallikarjun — who came together with a simple idea: to make high-quality, meaningful merchandise accessible to the entire COEP community. What started as late-night discussions in our hostel room turned into this platform — a space where every product carries a piece of COEP's spirit.
              </p>
              <p className="about-story-paragraph">
                This is more than just an e-commerce website. It's our way of giving back to the institute, celebrating our shared identity, and bringing the COEP community closer — through designs that we use, love, and are proud of.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 4 Value Pillars Row */}
        <section className="about-pillars-section">
          <div className="about-pillars-container">
            <div className="about-pillars-grid">

              {/* Pillar 1: By Students */}
              <div className="about-pillar-card">
                <div className="pillar-icon-bubble">
                  <Users className="pillar-icon" size={26} />
                </div>
                <h3 className="pillar-title">By Students</h3>
                <p className="pillar-subtext">
                  Built with passion, from one COEPian to another.
                </p>
              </div>

              {/* Pillar 2: For the Community */}
              <div className="about-pillar-card">
                <div className="pillar-icon-bubble">
                  <Gem className="pillar-icon" size={26} />
                </div>
                <h3 className="pillar-title">For the Community</h3>
                <p className="pillar-subtext">
                  Merchandise that brings us together.
                </p>
              </div>

              {/* Pillar 3: With a Purpose */}
              <div className="about-pillar-card">
                <div className="pillar-icon-bubble">
                  <Rocket className="pillar-icon" size={26} />
                </div>
                <h3 className="pillar-title">With a Purpose</h3>
                <p className="pillar-subtext">
                  More than products, it's a movement.
                </p>
              </div>

              {/* Pillar 4: Rooted in COEP */}
              <div className="about-pillar-card">
                <div className="pillar-icon-bubble">
                  <Heart className="pillar-icon" size={26} />
                </div>
                <h3 className="pillar-title">Rooted in COEP</h3>
                <p className="pillar-subtext">
                  Inspired by the legacy, driven by the future.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Our Vision Section (Split Banner) */}
        <section className="about-vision-section">
          <div className="about-vision-card">
            {/* Left Photo Column */}
            <div className="about-vision-photo-wrap">
              <img
                src="/COEPMAINBUILDING.png"
                alt="COEP Historic Campus Main Building"
                className="vision-campus-img"
              />
            </div>

            {/* Right Vision Text Column */}
            <div className="about-vision-content">
              {/* Background Gear Watermark */}
              <div className="vision-watermark-gear">
                <img src="/image.png" alt="COEP Gear Watermark" className="watermark-gear-img" />
              </div>

              <div className="vision-text-inner">
                <span className="about-section-eyebrow">OUR VISION</span>
                <h2 className="vision-heading">A Stronger COEP Tomorrow</h2>
                <div className="about-accent-bar vision-bar"></div>

                <p className="vision-description">
                  Through this platform, we hope to keep the COEP spirit alive — in classrooms, hostels, labs, and beyond. A small idea today can create a stronger, more connected COEP community tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;


