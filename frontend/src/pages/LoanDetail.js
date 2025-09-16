import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLoanById } from '../services/api';

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await getLoanById(id);
        setLoan(response.data.loan);
      } catch (err) {
        setError('Failed to fetch loan details.');
        console.error('Error fetching loan details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ marginTop: '100px' }}>Loading loan details...</div>;
  }

  if (error) {
    return <div className="container" style={{ marginTop: '100px' }}>Error: {error}</div>;
  }

  if (!loan) {
    return <div className="container" style={{ marginTop: '100px' }}>Loan not found.</div>;
  }

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>Loan Details</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>Customer:</strong> {loan.customer?.name}</p>
          <p><strong>Loan Amount:</strong> ₹{loan.loanAmount?.toLocaleString('en-IN')}</p>
          <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
          <p><strong>Total Repayable:</strong> ₹{loan.totalRepayable?.toLocaleString('en-IN')}</p>
          <p><strong>Loan Type:</strong> {loan.loanType}</p>
          <p><strong>Tenure:</strong> {loan.tenure} {loan.tenureUnit}</p>
          <p><strong>Installment:</strong> ₹{loan.installment?.toLocaleString('en-IN')}</p>
          <p><strong>Start Date:</strong> {new Date(loan.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(loan.endDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {loan.status}</p>
          <p><strong>Remaining Balance:</strong> ₹{loan.remainingBalance?.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/loans/edit/${loan._id}`} className="btn btn-warning" style={{ marginRight: '10px' }}>Edit Loan</Link>
        <Link to="/loans" className="btn btn-secondary">Back to Loans</Link>
      </div>
    </div>
  );
};

export default LoanDetail;