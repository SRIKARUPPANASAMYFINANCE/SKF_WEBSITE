import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

// Placeholder for a real image
const ownerImage = {
  // webp: '/images/owner.webp', // Removed webp
  original: '/images/owner.jpg', // Changed to .jpg
  alt: 'The SRI KARUPPANASAMY FINANCE office or owner'
};


const AboutUs = () => {
  return (
    <div className="page-container">
      <div className="container about-us-page">
        
        {/* Introduction Text */}
        <div className="intro-text">
          <h1>About</h1>
          <h2>SRI KARUPPANASAMY FINANCE</h2>
          <p className="section-description">
            SRI KARUPPANASAMY FINANCE provides fast, transparent short-term loans to individuals and small businesses in Chennai and karur. We prioritise clarity, fairness and personal support.
          </p>
          <p className="section-description">
            With over 9 years of experience in the community, we understand the urgent needs of our customers and are committed to providing financial assistance with integrity and respect.
          </p>
        </div>

        {/* Mission Box */}
        <div className="mission-box">
          <h2>Our Mission</h2>
          <p>To empower local individuals and small businesses with simple, accessible, and trustworthy financial solutions that help them achieve their immediate goals and foster community growth.</p>
        </div>

        {/* Values List */}
        <div className="values-list">
          <div className="value-item">
            <div className="icon">🤝</div>
            <h3>Trust & Transparency</h3>
            <p>We believe in clear communication with no hidden terms. What you see is what you get.</p>
          </div>
          <div className="value-item">
            <div className="icon">⚡</div>
            <h3>Speed & Simplicity</h3>
            <p>Our process is designed to be as fast and straightforward as possible, from application to approval.</p>
          </div>
          <div className="value-item">
            <div className="icon">❤️</div>
            <h3>Community First</h3>
            <p>We are a local business dedicated to supporting our neighbors and strengthening our community.</p>
          </div>
        </div>

        {/* Image */}
        {/* Removed picture tag, using direct img with .jpg */}
        <img src={ownerImage.original} alt={ownerImage.alt} className="about-photo" loading="lazy" />

        {/* Call to Action */}
        <div className="about-cta">
          <h2>Ready to Get Started?</h2>
          <p>Let us help you with your financial needs. Apply today for a quick and simple loan.</p>
          <Link to="/apply" className="btn btn-primary">Apply Now</Link>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;