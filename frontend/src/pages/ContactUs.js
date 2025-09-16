import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitMessage, setSubmitMessage] = useState({
    type: '', // 'success' or 'error'
    text: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    // In a real application, you would send this data to your backend
    console.log('Contact Form Data:', formData);
    setSubmitMessage({ type: 'success', text: 'Your message has been sent successfully!' });
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>Contact Us</h1>
          <p className="section-description">We'd love to hear from you! Reach out to us through any of the methods below.</p>
        </div>

        <div className="contact-content">
          {/* Contact Information Section */}
          <div className="contact-info-section">
            <h2>Our Details</h2>
            <p>
              <strong>Address:</strong> 114/8, Thundu Perumal Palayam, Poolampalayam, Athur, Karur 639008<br/>
              Thundu Perumal Palayam, Tamil Nadu 639008<br/>
              <span style={{fontSize: '0.95em', color: '#555'}}>Latitude: 11.023078, Longitude: 78.024265</span>
            </p>
            <p>
              <strong>Phone:</strong> <a href="tel:+916384102623" onClick={() => window.gtag('event', 'contact_call', { 'event_category': 'Contact', 'event_label': 'Phone Link' })}>+91 63841 02623</a>
            </p>
            <p>
              <strong>WhatsApp:</strong> <a href="https://wa.me/916384102623" target="_blank" rel="noopener noreferrer" onClick={() => window.gtag('event', 'whatsapp_click', { 'event_category': 'Contact', 'event_label': 'WhatsApp Link' })}>+91 63841 02623</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:srikaruppanasamyfinance@gmail.com">srikaruppanasamyfinance@gmail.com</a>
            </p>
            <p>
              <strong>Opening Hours:</strong> Mo-Sa: 09:00 AM - 07:00 PM
            </p>

            {/* Google Maps Embed Placeholder */}
            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Find Us on Map</h3>
            <iframe
              src="https://www.google.com/maps?q=11.023078,78.024265&hl=en&z=16&output=embed"
              width="1000"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-embed"
              title="Our Location"
            ></iframe>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitMessage.text && (
              <div className={`alert ${submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {submitMessage.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="form-control"
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>

        {/* Lending License/Registration Images Placeholder */}
        <div className="license-images">
          <h2 className="text-center">Our Registrations & Licenses</h2>
          <p className="text-center">Proudly registered and compliant with all local regulations.</p>
          {/* TODO: Replace with actual license images */}
          <img src="/images/logo.jpg" alt="Lending License 1" /> {/* Changed */}
          <img src="/images/owner.jpg" alt="Lending License 2" /> {/* Changed */}
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
