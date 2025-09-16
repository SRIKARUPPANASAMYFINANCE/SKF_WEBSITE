import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container">
      <h2>Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary">Go to Homepage</Link>
    </div>
  );
};

export default Unauthorized;