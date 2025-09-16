import React from 'react';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <img
            src={'/images/logo.png'}
            alt="Loading Logo"
            className="loading-logo"
          />
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Loading;