import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: '1',
      title: 'Contact Us',
      description: 'Reach out via our simple WhatsApp message or online application form.',
    },
    {
      icon: '2',
      title: 'Submit Documents',
      description: 'Provide basic KYC documents like Aadhaar, PAN, and a selfie for verification.',
    },
    {
      icon: '3',
      title: 'Quick Verification',
      description: 'Our team will verify your documents and assess your application within 24-48 hours.',
    },
    {
      icon: '4',
      title: 'Receive Your Loan',
      description: 'Once approved, the loan amount is disbursed directly to your bank account.',
    },
    {
      icon: '5',
      title: 'Repay Weekly',
      description: 'Make simple, manageable weekly repayments via cash, UPI, or bank transfer.',
    },
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>How It Works</h1>
          <p>Our loan process is designed to be as simple and transparent as possible. <br />Follow these five easy steps to get your loan.</p>
        </div>

        <div className="step-flow-container">
          {steps.map((step, index) => (
            <div className="step-item" key={index}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-cta margin-top-large">
          <h2>Simple, Fast, and Transparent</h2>
          <p>Ready to take the first step? Apply now and get a quick response.</p>
          <Link to="/apply" className="btn btn-primary">Apply for a Loan</Link>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
