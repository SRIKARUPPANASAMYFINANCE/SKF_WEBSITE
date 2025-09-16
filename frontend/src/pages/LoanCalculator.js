import React, { useState, useEffect, useRef } from 'react';
import { calculateLoan } from '../services/api';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [loanType, setLoanType] = useState('weekly'); // weekly or monthly
  const [interestRate, setInterestRate] = useState('25'); // Default as per spec
  const [tenure, setTenure] = useState('10'); // Default as per spec
  const [tenureUnit, setTenureUnit] = useState('weeks'); // weeks or months
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalRepayableRef = useRef(null);

  // Client-side simple interest calculation (as per spec)
  const calcSimpleClient = (p, r, t, unit) => {
    const totalInterest = p * (r / 100);
    const totalRepayable = p + totalInterest;
    let installment = 0;
    if (unit === 'weeks') {
      installment = totalRepayable / t;
    } else if (unit === 'months') {
      installment = totalRepayable / t;
    }
    return {
      totalInterest: totalInterest.toFixed(2),
      totalRepayable: totalRepayable.toFixed(2),
      installment: installment.toFixed(2),
      installmentLabel: unit === 'weeks' ? 'Weekly Installment' : 'Monthly Installment'
    };
  };

  // Animation function for numbers
  const animateCount = (el, from = 0, to = 10000, duration = 800) => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const val = from + (to - from) * t;
      el.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (results && totalRepayableRef.current) {
      const currentVal = parseFloat(totalRepayableRef.current.textContent.replace(/[^0-9.-]+/g,"")) || 0;
      animateCount(totalRepayableRef.current, currentVal, parseFloat(results.totalRepayable), 800);
    }
  }, [results]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults(null);

    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    let t = parseInt(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      setError('Please enter valid positive numbers for all fields.');
      setLoading(false);
      return;
    }

    let tenureInWeeks = t;
    if (tenureUnit === 'months') {
      tenureInWeeks = t * 4; // Assuming 4 weeks per month
    }

    // Display client-side results instantly
    setResults(calcSimpleClient(p, r, t, tenureUnit));

    // Optionally, send to backend for validation/server-side calculation
    try {
      const response = await calculateLoan(p, r, tenureInWeeks);
      // If backend calculation differs or has more details, update results here
      // For now, we'll just log it to confirm backend works
      console.log('Backend Calculation:', response.data);
    } catch (err) {
      console.error('Error fetching backend calculation:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to get server calculation.');
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="page-container">
      <div className="container">
        <div className="loan-calculator-container">
          <h1 className="text-center">Loan Calculator</h1>
          <p className="text-center">Estimate your weekly payments and total repayment for a simple interest loan.</p>

          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label htmlFor="principal">Loan Principal Amount (₹)</label>
              <input 
                type="number" 
                id="principal" 
                name="principal" 
                value={principal} 
                onChange={(e) => setPrincipal(e.target.value)}
                className="form-control"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loanType">Loan Type</label>
              <select 
                id="loanType" 
                name="loanType" 
                value={loanType} 
                onChange={(e) => {
                  setLoanType(e.target.value);
                  if (e.target.value === 'monthly') {
                    setInterestRate('25');
                    setTenure('4');
                    setTenureUnit('months');
                  } else {
                    setInterestRate('25');
                    setTenure('10');
                    setTenureUnit('weeks');
                  }
                }}
                className="form-control"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <input 
                type="number" 
                id="interestRate" 
                name="interestRate" 
                value={interestRate} 
                onChange={(e) => setInterestRate(e.target.value)}
                className="form-control"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tenure">Tenure ({tenureUnit})</label>
              <input 
                type="number" 
                id="tenure" 
                name="tenure" 
                value={tenure} 
                onChange={(e) => setTenure(e.target.value)}
                className="form-control"
                min="1"
                required
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate Loan'}
            </button>
          </form>

          {results && (
            <div className="calculator-results">
              <h2>Calculation Results</h2>
              <div>
                <span>Total Interest:</span>
                <span>{formatCurrency(results.totalInterest)}</span>
              </div>
              <div>
                <span>Total Repayable:</span>
                <span ref={totalRepayableRef}>{formatCurrency(0)}</span>
              </div>
              <div>
                <span>{results.installmentLabel}:</span>
                <span>{formatCurrency(results.installment)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
