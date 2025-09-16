import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    setIsNavOpen(false);
    navigate('/login');
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Close mobile nav on route change
    closeNav();
  }, [location]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <h1>
              <NavLink to="/" onClick={closeNav}>
                SK <span>Finance</span>
              </NavLink>
            </h1>
          </div>
          <button className="hamburger" onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Toggle navigation">
            <div className={`bar1 ${isNavOpen ? 'open' : ''}`}></div>
            <div className={`bar2 ${isNavOpen ? 'open' : ''}`}></div>
            <div className={`bar3 ${isNavOpen ? 'open' : ''}`}></div>
          </button>
          <ul className={`nav-links ${isNavOpen ? 'active' : ''}`}>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/about">About Us</NavLink></li>
            <li><NavLink to="/services">Loan Services</NavLink></li>
            <li><NavLink to="/how-it-works">How It Works</NavLink></li>
            <li><NavLink to="/contact">Contact Us</NavLink></li>
            <li><NavLink to="/testimonials">Testimonials</NavLink></li>
            <li><NavLink to="/faq">FAQ</NavLink></li>
            {user ? (
              <>
                {user.role === 'admin' && <li><NavLink to="/dashboard">Admin Dashboard</NavLink></li>}
                <li className="user-welcome"><span>Welcome, {user.name}</span></li>
                <li><button onClick={handleLogout} className="btn btn-danger">Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item-login"><NavLink to="/login" className="btn btn-secondary">Login</NavLink></li>
                <li><NavLink to="/apply" className="btn btn-primary">Apply Now</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </nav>
      {isNavOpen && <div className="overlay" onClick={closeNav}></div>}
    </>
  );
};

export default Navbar;