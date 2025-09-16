import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    aadhaarNumber: '',
    panNumber: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      alert('Customer created successfully!');
      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer. Please try again.');
    }
  };

  return (
    <div className="customer-form-container">
      <div className="form-header">
        <h2>Add New Customer</h2>
        <p>Enter customer details to create a new account</p>
      </div>
      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="required-field">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar number"
                pattern="[0-9]{12}"
                title="Please enter a valid 12-digit Aadhaar number"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                title="Please enter a valid PAN number"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Address Details</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="required-field">Street Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Enter street address"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Pincode</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Enter 6-digit pincode"
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pincode"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Customer</button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;