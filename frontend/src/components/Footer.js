import '../styles/Footer.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-top">
        <div className="footer-column">
          <div className="footer-brand">
            <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="SRI KARUPPANASAMY FINANCE Logo" className="footer-logo" />
            <div className="footer-brand-text">
              <h2>SRI KARUPPANASAMY FINANCE</h2>
            </div>
          </div>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <p><strong>Phone:</strong> <a href="tel:+916384102623">+91 63841 02623</a></p>
            <p><strong>Email:</strong> <a href="mailto:srikaruppanasamyfinance@gmail.com">srikaruppanasamyfinance@gmail.com</a></p>
            <p><strong>Address:</strong> 114/8, Thundu Perumal Palayam, Poolampalayam, Athur, Karur 639008</p>
          </div>
        </div>
      </div>
      <div className="footer-middle">
        <div className="footer-subscribe">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest updates and offers.</p>
          <form className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon"><i className="fab fa-facebook-f"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><i className="fab fa-instagram"></i></a>
          <a href="https://wa.me/916384102623" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon"><i className="fab fa-whatsapp"></i></a>
        </div>
        <div className="footer-copyright">
          <p>Copyright &copy; 2025 SRI KARUPPANASAMY FINANCE</p>
          <p>Designed and developed by Suganth Kanagaraj</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
