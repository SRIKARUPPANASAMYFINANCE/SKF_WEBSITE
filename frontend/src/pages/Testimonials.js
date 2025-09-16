import React from 'react';
import { Link } from 'react-router-dom';
import './Testimonials.css';

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      stars: 5,
      quote: "SRI KARUPPANASAMY FINANCE made getting a loan incredibly easy and fast. Their transparent terms were a breath of fresh air!",
      author: "Priya S.",
      photo: "/images/logo.png", // Changed
    },
    {
      id: 2,
      stars: 5,
      quote: "The weekly repayment plan was perfect for my small business. Highly recommend their local support.",
      author: "Rajesh K.",
      photo: "/images/logo.png", // Changed
    },
    {
      id: 3,
      stars: 4,
      quote: "Quick approval and no hidden fees. A trustworthy financial partner in the community.",
      author: "Anjali M.",
      photo: "/images/logo.png", // Changed
    },
    {
      id: 4,
      stars: 5,
      quote: "Needed funds urgently and they delivered. The process was smooth and the staff were very helpful.",
      author: "Vikram R.",
      photo: "/images/logo.png", // Changed
    },
  ];

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>What Our Customers Say</h1>
          <p className="section-description">Hear directly from the people we've helped achieve their financial goals.</p>
        </div>

        <div className="testimonials-grid">
          {testimonialsData.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="stars">{renderStars(testimonial.stars)}</div>
              <p className="quote">"{testimonial.quote}"</p>
              <p className="author">
                {testimonial.photo && <img src={testimonial.photo} alt={testimonial.author} className="author-photo" />}
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        <div className="about-cta margin-top-large">
          <h2>Share Your Experience</h2>
          <p>Have you had a positive experience with SRI KARUPPANASAMY FINANCE? We'd love to hear your story!</p>
          {/* This link can lead to a simple form or directly to WhatsApp */}
          <Link to="/contact" className="btn btn-primary">Share Your Story</Link>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
