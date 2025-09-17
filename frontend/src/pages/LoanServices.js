import React from 'react';
import { Link } from 'react-router-dom';
import './LoanServices.css';

const LoanServices = () => {
  const loanProducts = [
    {
      icon: '👤',
      name: 'Personal Loan',
      tenure: '10 weeks',
      repayment: 'Weekly',
      maxAmount: '50,000',
    },
    {
      icon: '🏪',
      name: 'Small Business Loan',
      tenure: '10 weeks',
      repayment: 'Weekly',
      maxAmount: '1,00,000',
    },
    {
      icon: '🎓',
      name: 'Education Loan',
      tenure: '10 weeks',
      repayment: 'Weekly',
      maxAmount: '75,000',
    },
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>Our Loan Products</h1>
          <p>Simple, transparent loan products designed for your immediate needs.</p>
        </div>

        {/* Product Cards */}
        <div className="loan-products-grid">
          {loanProducts.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="icon">{product.icon}</div>
              <h3>{product.name}</h3>
              <ul>
                <li><strong>Tenure:</strong> {product.tenure}</li>
                <li><strong>Repayment:</strong> {product.repayment}</li>
                <li><strong>Max Amount:</strong> ₹{product.maxAmount}</li>
              </ul>
              <Link to="/apply" className="btn btn-primary">Apply Now</Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="text-center margin-top-large">
          <h2>Compare Our Loans</h2>
        </div>
        <div className="table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {loanProducts.map((p, i) => <th key={i}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Max Loan Amount</strong></td>
                {loanProducts.map((p, i) => <td key={i}>₹{p.maxAmount}</td>)}
              </tr>
              <tr>
                <td><strong>Tenure</strong></td>
                {loanProducts.map((p, i) => <td key={i}>{p.tenure}</td>)}
              </tr>
              <tr>
                <td><strong>Repayment</strong></td>
                {loanProducts.map((p, i) => <td key={i}>{p.repayment}</td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Loan Calculator CTA */}
        <div className="calculator-cta margin-top-large">
          <h2 style={{color: '#2c3e50'}}>Not Sure Which Loan is Right for You?</h2>
          <p style={{color: 'black'}}>Use our simple loan calculator to estimate your weekly payments.</p>
          <Link to="/calculator" className="btn btn-primary">Open Loan Calculator</Link>
        </div>

      </div>
    </div>
  );
};

export default LoanServices;
