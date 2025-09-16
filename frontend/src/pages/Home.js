import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const slides = [
  {
    type: 'image',
    src: '/images/logo.png',
    alt: 'SRI KARUPPANASAMY FINANCE Logo',
    title: 'SRI KARUPPANASAMY FINANCE',
    subtitle: 'Empowering Your Financial Journey'
  },
  {
    type: 'image',
    src: '/images/owner.jpg',
    alt: 'SRI KARUPPANASAMY FINANCE Owner',
    title: '  Meet Our Founder',
    subtitle: 'Dedicated to Your Prosperity'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-container">
      {/* 1. Hero Slideshow */}
      <section id="hero" className="hero">
        <div className="hero__carousel">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'is-active' : ''}`}
            >
              <div className="hero__content">
                {slide.type === 'image' && <img src={slide.src} alt={slide.alt} className="slide-image" />}
                {slide.type === 'service' && <div className="slide-icon">{slide.icon}</div>}
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">⚡</div>
              <h3>Quick Approval</h3>
              <p>Fast decision on your loan application.</p>
            </div>
            <div className="feature-card">
              <div className="icon">💎</div>
              <h3>Transparent</h3>
              <p>No hidden fees, clear terms.</p>
            </div>
            <div className="feature-card">
              <div className="icon">📍</div>
              <h3>Local</h3>
              <p>Serving our local community.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🔄</div>
              <h3>Flexible Plans</h3>
              <p>Choose weekly or monthly repayment.</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* 4. Loan Calculator */}
      <section className="loan-calculator-section">
        <div className="container text-center">
          <h2>Loan Calculator</h2>
          <p className="section-description">Calculate your repayment in seconds.</p>
          <div className="calculator-placeholder">
            <p>Interactive Loan Calculator will go here.</p>
            <Link to="/calculator" className="btn btn-primary">Go to Calculator Page</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;