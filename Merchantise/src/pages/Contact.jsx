import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Send,
  CheckCircle2,
  ArrowRight,
  Star,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Heart,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

export const Contact = () => {
  const { showToast } = useCart();
  const [activeFormTab, setActiveFormTab] = useState('feedback'); // 'feedback' | 'inquiry'

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  // Project Feedback Form State
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    role: 'Current Student',
    category: 'Website Design & UI',
    rating: 5,
    feedback: '',
    recommend: 'yes'
  });
  const [ratingHover, setRatingHover] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const ratingLabels = {
    1: '1/5 • Needs Improvement',
    2: '2/5 • Fair',
    3: '3/5 • Good',
    4: '4/5 • Very Good',
    5: '5/5 • Excellent & Loved It!'
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSendingInquiry(true);

    try {
      // Send email directly to thehouseofcoep1854@gmail.com via FormSubmit API
      await fetch('https://formsubmit.co/ajax/thehouseofcoep1854@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[COEP Merch Inquiry] ${formData.subject || 'Direct Inquiry'} - from ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: formData.email,
          'Sender Name': formData.name,
          'Sender Email': formData.email,
          'Query Category': formData.category,
          'Subject': formData.subject,
          'Message / Details': formData.message,
          'Sent At': new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Network email dispatch failed, falling back to local storage', err);
    }

    // Save backup to localStorage
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('coep_inquiries') || '[]');
      const newInquiry = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('coep_inquiries', JSON.stringify([newInquiry, ...existingInquiries]));
    } catch (err) {
      console.warn('Could not save inquiry to localStorage', err);
    }

    setIsSendingInquiry(false);
    setSubmitted(true);
    showToast('Your message has been sent to thehouseofcoep1854@gmail.com! We will get back to you shortly.', 'cart');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSendingFeedback(true);

    try {
      // Send feedback email directly to thehouseofcoep1854@gmail.com via FormSubmit API
      await fetch('https://formsubmit.co/ajax/thehouseofcoep1854@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `⭐ [COEP Merch Feedback: ${feedbackData.rating}/5 Stars] from ${feedbackData.name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: feedbackData.email,
          'Star Rating': `${feedbackData.rating} / 5 Stars (${ratingLabels[feedbackData.rating]})`,
          'Reviewer Name': feedbackData.name,
          'Reviewer Email': feedbackData.email,
          'COEP Association': feedbackData.role,
          'Feedback Focus Area': feedbackData.category,
          'Comments & Suggestions': feedbackData.feedback,
          'Would Recommend': feedbackData.recommend === 'yes' ? 'Definitely, Yes!' : 'Maybe with improvements',
          'Sent At': new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Network email dispatch failed, falling back to local storage', err);
    }

    // Save backup to localStorage
    try {
      const existingFeedbacks = JSON.parse(localStorage.getItem('coep_feedbacks') || '[]');
      const newFeedback = {
        id: Date.now(),
        ...feedbackData,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('coep_feedbacks', JSON.stringify([newFeedback, ...existingFeedbacks]));
    } catch (err) {
      console.warn('Could not save feedback to localStorage', err);
    }

    setIsSendingFeedback(false);
    setFeedbackSubmitted(true);
    showToast('Thank you! Your feedback has been sent directly to thehouseofcoep1854@gmail.com.', 'cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Contact Hero Section */}
        <section className="contact-hero-wrapper">
          {/* Ambient Background Glows & Organic Shapes */}
          <div className="contact-bg-blob blob-1"></div>
          <div className="contact-bg-blob blob-2"></div>

          <div className="contact-hero-container">
            {/* Left Column: Text & Eyebrow */}
            <div className="contact-hero-content">
              <span className="contact-eyebrow">CONTACT & FEEDBACK</span>
              <h1 className="contact-main-title">
                Let’s <span className="highlight-touch">Connect</span>
              </h1>
              <p className="contact-hero-subtitle">
                Have a query or want to share feedback on our project? We'd love to hear from fellow COEPians and supporters!
              </p>
              <div className="contact-accent-bar"></div>
            </div>

            {/* Right Column: Visual Stage with mainbuilding.png */}
            <div className="contact-hero-visual">
              <div className="contact-building-frame">
                <img
                  src="/mainbuilding.png"
                  alt="COEP Historic Main Building Architectural Sketch"
                  className="building-sketch-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details Cards Section */}
        <section className="contact-cards-container">
          <div className="contact-section-header">
            <h2 className="contact-section-title">Contact Details</h2>
            <p className="contact-section-subtitle">Here are the best ways to reach us.</p>
          </div>

          <div className="contact-cards-grid">
            {/* Email Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <Mail className="contact-icon" size={24} />
              </div>
              <h3 className="contact-card-title">Email</h3>
              <a href="mailto:thehouseofcoep1854@gmail.com" className="contact-card-link">
                thehouseofcoep1854@gmail.com
              </a>
              <p className="contact-card-subtext">For general queries and support</p>
              <a href="mailto:thehouseofcoep1854@gmail.com" className="card-action-link">
                <span>Send an Email</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Phone Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <Phone className="contact-icon" size={24} />
              </div>
              <h3 className="contact-card-title">Phone</h3>
              <p className="contact-card-value">+91 97304 92964</p>
              <p className="contact-card-subtext">Mon – Sat, 9:00 AM – 5:00 PM</p>
              <a href="tel:+919730492964" className="card-action-link">
                <span>Call Now</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Location Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <MapPin className="contact-icon" size={24} />
              </div>
              <h3 className="contact-card-title">Location</h3>
              <div className="contact-card-address">
                <p>COEP Technological University</p>
                <p>Shivajinagar, Pune – 411005</p>
                <p>Maharashtra, India</p>
              </div>
              <a
                href="https://maps.google.com/?q=COEP+Technological+University+Shivajinagar+Pune"
                target="_blank"
                rel="noreferrer"
                className="card-action-link"
              >
                <span>View on Maps</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Merchandise Team Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <Users className="contact-icon" size={24} />
              </div>
              <h3 className="contact-card-title">Merchandise Team</h3>
              <p className="contact-card-value">COEP Student Council</p>
              <p className="contact-card-subtext">For product, event and collaboration queries</p>
              <a href="#interactive-forms-section" className="card-action-link">
                <span>Get in Touch</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Forms Section (Inquiry & Project Feedback) */}
        <section className="contact-form-section" id="interactive-forms-section">
          <div className="contact-form-wrapper">

            {/* Form Mode Segmented Switcher */}
            <div className="contact-form-tabs">
              <button
                type="button"
                className={`form-tab-btn ${activeFormTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('feedback')}
              >
                <Star size={18} className="tab-icon text-amber-500 fill-amber-400" />
                <span>Feedback Form</span>
                <span className="tab-pill-badge">Recommended</span>
              </button>
              <button
                type="button"
                className={`form-tab-btn ${activeFormTab === 'inquiry' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('inquiry')}
              >
                <MessageSquare size={18} className="tab-icon" />
                <span>Send Direct Inquiry</span>
              </button>
            </div>

            {/* TAB 1: PROJECT FEEDBACK FORM */}
            {activeFormTab === 'feedback' && (
              <>
                <div className="form-header text-center">
                  <span className="badge-pill-accent">Customer & Student Voice</span>
                  <h2 className="form-section-title">Share Your Project Feedback</h2>
                  <p className="form-section-desc">
                    Your feedback drives our project! Let us know how we can make the COEP Merchandise store better for you.
                  </p>
                </div>

                {feedbackSubmitted ? (
                  <div className="contact-success-box text-center">
                    <div className="success-star-ring">
                      <Star size={48} className="mx-auto text-amber-500 fill-amber-400 mb-2 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You for Your Valuable Feedback!</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Your rating and suggestions have been delivered directly to <strong className="text-blue-900 font-semibold">thehouseofcoep1854@gmail.com</strong>. Your inputs help us continuously improve the COEP Merchandise store!
                    </p>
                    <button
                      onClick={() => {
                        setFeedbackSubmitted(false);
                        setFeedbackData({
                          name: '',
                          email: '',
                          role: 'Current Student',
                          category: 'Website Design & UI',
                          rating: 5,
                          feedback: '',
                          recommend: 'yes'
                        });
                      }}
                      className="btn-secondary-outline"
                    >
                      Submit Another Response
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="contact-form-element feedback-form-element">
                    {/* Star Rating Box */}
                    <div className="feedback-rating-container">
                      <label className="form-label rating-title">Overall Project Experience *</label>
                      <div className="star-rating-row">
                        <div className="stars-interactive-group">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="star-btn"
                              onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                              onMouseEnter={() => setRatingHover(star)}
                              onMouseLeave={() => setRatingHover(0)}
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                size={32}
                                className={`star-icon ${(ratingHover || feedbackData.rating) >= star ? 'active-star' : 'inactive-star'}`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="rating-status-pill">
                          {ratingLabels[ratingHover || feedbackData.rating]}
                        </span>
                      </div>
                    </div>

                    {/* Name & Email Row */}
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="fb-name" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          id="fb-name"
                          required
                          placeholder="e.g. Siddhesh chitkeshiwar"
                          value={feedbackData.name}
                          onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                          className="contact-input-field"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="fb-email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          id="fb-email"
                          required
                          placeholder="e.g. rahul@example.com"
                          value={feedbackData.email}
                          onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                          className="contact-input-field"
                        />
                      </div>
                    </div>

                    {/* Role & Feedback Category */}
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="fb-role" className="form-label">Your Association with COEP</label>
                        <select
                          id="fb-role"
                          value={feedbackData.role}
                          onChange={(e) => setFeedbackData({ ...feedbackData, role: e.target.value })}
                          className="contact-input-field contact-select-field"
                        >
                          <option value="Current Student">Current COEP Student</option>
                          <option value="COEP Alumni">COEP Alumni</option>
                          <option value="Faculty / Staff">Faculty / Staff Member</option>
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Campus Visitor">Guest / Well-wisher</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="fb-category" className="form-label">Feedback Focus Area</label>
                        <select
                          id="fb-category"
                          value={feedbackData.category}
                          onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}
                          className="contact-input-field contact-select-field"
                        >
                          <option value="Website Design & UI">Website Design & User Interface</option>
                          <option value="Product Variety & Catalog">Product Variety & Catalog</option>
                          <option value="Quality & Pricing">Product Quality & Pricing</option>
                          <option value="New Feature Suggestion">New Feature or Merchandise Suggestion</option>
                          <option value="General Encouragement">General Feedback & Encouragement</option>
                        </select>
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div className="form-group">
                      <label htmlFor="fb-feedback" className="form-label">Your Thoughts, Review & Suggestions *</label>
                      <textarea
                        id="fb-feedback"
                        rows={4}
                        required
                        placeholder="What do you like most about the COEP Merchandise store? What new products or features should we add next?"
                        value={feedbackData.feedback}
                        onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                        className="contact-input-field contact-textarea"
                      ></textarea>
                    </div>

                    {/* Would you recommend */}
                    <div className="form-group">
                      <label className="form-label">Would you recommend COEP Merchandise to fellow COEPians?</label>
                      <div className="recommend-toggle-row">
                        <button
                          type="button"
                          className={`recommend-chip ${feedbackData.recommend === 'yes' ? 'active' : ''}`}
                          onClick={() => setFeedbackData({ ...feedbackData, recommend: 'yes' })}
                        >
                          <ThumbsUp size={16} />
                          <span>Definitely, Yes!</span>
                        </button>
                        <button
                          type="button"
                          className={`recommend-chip ${feedbackData.recommend === 'neutral' ? 'active' : ''}`}
                          onClick={() => setFeedbackData({ ...feedbackData, recommend: 'neutral' })}
                        >
                          <span>Maybe with some improvements</span>
                        </button>
                      </div>
                    </div>

                    <div className="form-submit-wrap">
                      <button
                        type="submit"
                        disabled={isSendingFeedback}
                        className="contact-submit-btn feedback-submit-btn"
                      >
                        {isSendingFeedback ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending Feedback to thehouseofcoep1854@gmail.com...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Submit Project Feedback</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: DIRECT INQUIRY FORM */}
            {activeFormTab === 'inquiry' && (
              <>
                <div className="form-header text-center">
                  <span className="badge-pill-accent">Direct Inquiry</span>
                  <h2 className="form-section-title">Send Us a Direct Message</h2>
                  <p className="form-section-desc">Have a specific question about bulk orders, customization, or order tracking? Fill out the form below.</p>
                </div>

                {submitted ? (
                  <div className="contact-success-box text-center">
                    <CheckCircle2 size={56} className="mx-auto text-emerald-600 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Thank you for reaching out! Your inquiry has been forwarded directly to <strong className="text-blue-900 font-semibold">thehouseofcoep1854@gmail.com</strong>. We will review your message and reply via email within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
                      }}
                      className="btn-secondary-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="contact-form-element">
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          required
                          placeholder="e.g. Rahul Deshmukh"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="contact-input-field"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          required
                          placeholder="e.g. rahul@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="contact-input-field"
                        />
                      </div>
                    </div>

                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="category" className="form-label">Query Category</label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="contact-input-field contact-select-field"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Status & Shipping</option>
                          <option value="sizing">Product Sizing & Stock</option>
                          <option value="bulk">Bulk Order & Customization</option>
                          <option value="collaboration">Event / Student Council Query</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject" className="form-label">Subject *</label>
                        <input
                          type="text"
                          id="subject"
                          required
                          placeholder="e.g. Order #1042 Delivery Update"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="contact-input-field"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">Message / Details *</label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        placeholder="Write your query or details here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="contact-input-field contact-textarea"
                      ></textarea>
                    </div>

                    <div className="form-submit-wrap">
                      <button
                        type="submit"
                        disabled={isSendingInquiry}
                        className="contact-submit-btn"
                      >
                        {isSendingInquiry ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending to thehouseofcoep1854@gmail.com...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </section>

        {/* Community Support Banner */}
        <section className="contact-community-section">
          <div className="community-banner-card">
            <div className="community-content">
              <span className="community-eyebrow">TOGETHER FOR A STRONGER TOMORROW</span>
              <h2 className="community-headline">Support the COEP Community</h2>
              <p className="community-subtext">
                Your feedback and suggestions help us improve and serve you better.
              </p>
            </div>
            <div className="community-action">
              <Link to="/shop" className="community-shop-btn">
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
