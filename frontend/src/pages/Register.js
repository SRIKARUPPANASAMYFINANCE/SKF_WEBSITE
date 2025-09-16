import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Assuming you'll add registerUser to api.js

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'agent', // Default role
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({
    type: '', // 'success' or 'error'
    text: '',
  });
  const [loading, setLoading] = useState(false);

  const roles = ['agent', 'admin']; // Available roles for registration

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.email = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? "" : "Valid email is required.";
    tempErrors.password = formData.password ? "" : "Password is required.";
    tempErrors.password2 = formData.password2 ? "" : "Confirm Password is required.";
    tempErrors.role = formData.role ? "" : "Role is required.";

    if (formData.password !== formData.password2) {
      tempErrors.password2 = "Passwords do not match.";
    }

    setErrors({
      ...tempErrors
    });

    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing/changing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setSubmitMessage({ type: '', text: '' });
      try {
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        
        const response = await registerUser(dataToSend);
        setSubmitMessage({
          type: 'success',
          text: response.data.message || 'User registered successfully!',
        });
        setFormData({ // Clear form
          name: '',
          email: '',
          password: '',
          password2: '',
          role: 'agent',
        });
        window.scrollTo(0, 0); // Scroll to top to show message
      } catch (err) {
        console.error('Registration error:', err.response?.data || err);
        setSubmitMessage({
          type: 'error',
          text: err.response?.data?.message || 'Registration failed. Please try again.',
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="register-form-container">
          <h1>Register New User</h1>
          {submitMessage.text && (
            <div className={`alert ${submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {submitMessage.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="form-control"
                autocomplete="name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="form-control"
                autocomplete="email"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="form-control"
                autocomplete="new-password"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password2">Confirm Password</label>
              <input 
                type="password" 
                id="password2" 
                name="password2" 
                value={formData.password2} 
                onChange={handleChange} 
                className="form-control"
                autocomplete="new-password"
              />
              {errors.password2 && <p className="error-text">{errors.password2}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="form-control"
                autocomplete="off"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              {errors.role && <p className="error-text">{errors.role}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;