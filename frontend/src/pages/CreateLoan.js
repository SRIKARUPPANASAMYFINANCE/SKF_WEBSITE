import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewLoan = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    loanAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    loanType: 'weekly'
  });
  const [calculatedValues, setCalculatedValues] = useState({
    interest: 0,
    totalRepayable: 0,
    weeklyInstallment: 0,
    endDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    calculateLoanDetails();
  }, [formData.loanAmount, formData.startDate]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const calculateLoanDetails = () => {
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    const interestRate = 25; // 25%
    let tenure;
    let tenureUnit;

    if (formData.loanType === 'monthly') {
      tenure = 4; // 4 months
      tenureUnit = 'months';
    } else {
      tenure = 10; // 10 weeks
      tenureUnit = 'weeks';
    }
    
    const interest = loanAmount * (interestRate / 100);
    const totalRepayable = loanAmount + interest;
    let installment = 0;
    if (tenureUnit === 'weeks') {
      installment = totalRepayable / tenure;
    } else if (tenureUnit === 'months') {
      installment = totalRepayable / tenure;
    }
    
    // Calculate end date
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      if (tenureUnit === 'weeks') {
        endDate.setDate(endDate.getDate() + (tenure * 7));
      } else if (tenureUnit === 'months') {
        endDate.setMonth(endDate.getMonth() + tenure);
      }
      
      setCalculatedValues({
        interest,
        totalRepayable,
        installment,
        endDate: endDate.toISOString().split('T')[0],
        tenure, 
        tenureUnit
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans', formData);
      alert('Loan created successfully!');
      navigate('/loans');
    } catch (error) {
      console.error('Error creating loan:', error);
      alert('Error creating loan. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Create New Loan</h2>
      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-group">
          <label>Customer</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Loan Type</label>
          <select 
            name="loanType" 
            value={formData.loanType} 
            onChange={handleChange}
            required
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="form-group">
          <label>Loan Amount (₹)</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="calculation-results">
          <h3>Loan Calculation</h3>
          <div className="result-item">
            <span>Interest Rate:</span>
            <span>25%</span>
          </div>
          <div className="result-item">
            <span>Tenure:</span>
            <span>{calculatedValues.tenure} {calculatedValues.tenureUnit}</span>
          </div>
          <div className="result-item">
            <span>Total Interest:</span>
            <span>₹{calculatedValues.interest.toFixed(2)}</span>
          </div>
          <div className="result-item">
            <span>Total Repayable:</span>
            <span>₹{calculatedValues.totalRepayable.toFixed(2)}</span>
          </div>
          <div className="result-item">
            <span>{formData.loanType === 'weekly' ? 'Weekly' : 'Monthly'} Installment:</span>
            <span>₹{calculatedValues.installment.toFixed(2)}</span>
          </div>
          <div className="result-item">
            <span>End Date:</span>
            <span>{calculatedValues.endDate}</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Loan</button>
      </form>
    </div>
  );
};

export default NewLoan;