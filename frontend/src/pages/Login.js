import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Import the new CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({
    type: '', // 'success' or 'error'
    text: '',
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? "" : "Valid email is required.";
    tempErrors.password = formData.password ? "" : "Password is required.";

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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard'); // Redirect to dashboard on successful login
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Login failed. Please check your credentials.',
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="login-form-container">
          <h1>Login</h1>
          {submitMessage.text && (
            <div className={`alert ${submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {submitMessage.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
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
                autocomplete="current-password"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;