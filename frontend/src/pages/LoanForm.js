import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createLoan, getLoanById, updateLoan } from '../services/api';

const LoanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState({
    customerId: '',
    loanAmount: '',
    startDate: '',
    loanType: 'monthly',
    interestRate: '',
    tenure: '',
    tenureUnit: '',
    totalRepayable: '',
    installment: '',
    remainingBalance: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch loan details if in edit mode
      const fetchLoan = async () => {
        setLoading(true);
        try {
          const response = await getLoanById(id);
          const loan = response.data.loan;
          setLoanData({
            customerId: loan.customer._id, // Assuming customer object is populated
            loanAmount: loan.loanAmount,
            startDate: loan.startDate.split('T')[0], // Format date for input
            loanType: loan.loanType,
            interestRate: loan.interestRate,
            tenure: loan.tenure,
            tenureUnit: loan.tenureUnit,
            totalRepayable: loan.totalRepayable,
            installment: loan.installment,
            remainingBalance: loan.remainingBalance,
            status: loan.status,
          });
        } catch (err) {
          setError('Failed to fetch loan for editing.');
          console.error('Error fetching loan for edit:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchLoan();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        // Update existing loan
        await updateLoan(id, loanData);
        setSuccess('Loan updated successfully!');
      } else {
        // Create new loan
        await createLoan(loanData);
        setSuccess('Loan created successfully!');
        setLoanData({ // Clear form after successful creation
          customerId: '',
          loanAmount: '',
          startDate: '',
          loanType: 'monthly',
          interestRate: '',
          tenure: '',
          tenureUnit: '',
          totalRepayable: '',
          installment: '',
          remainingBalance: '',
          status: 'active',
        });
      }
      navigate('/loans'); // Redirect to loan list after success
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      console.error('Error saving loan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) { // Show loading only when fetching existing loan for edit
    return <div className="container" style={{ marginTop: '100px' }}>Loading loan data...</div>;
  }

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>{id ? 'Edit Loan' : 'Create New Loan'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerId">Customer ID:</label>
          <input
            type="text"
            className="form-control"
            id="customerId"
            name="customerId"
            value={loanData.customerId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount:</label>
          <input
            type="number"
            className="form-control"
            id="loanAmount"
            name="loanAmount"
            value={loanData.loanAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={loanData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanType">Loan Type:</label>
          <select
            className="form-control"
            id="loanType"
            name="loanType"
            value={loanData.loanType}
            onChange={handleChange}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        {/* Display calculated fields if available, or allow input for admin */}
        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%):</label>
          <input
            type="number"
            className="form-control"
            id="interestRate"
            name="interestRate"
            value={loanData.interestRate}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tenure">Tenure:</label>
          <input
            type="number"
            className="form-control"
            id="tenure"
            name="tenure"
            value={loanData.tenure}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tenureUnit">Tenure Unit:</label>
          <select
            className="form-control"
            id="tenureUnit"
            name="tenureUnit"
            value={loanData.tenureUnit}
            onChange={handleChange}
            required
          >
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="totalRepayable">Total Repayable:</label>
          <input
            type="number"
            className="form-control"
            id="totalRepayable"
            name="totalRepayable"
            value={loanData.totalRepayable}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="installment">Installment:</label>
          <input
            type="number"
            className="form-control"
            id="installment"
            name="installment"
            value={loanData.installment}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="remainingBalance">Remaining Balance:</label>
          <input
            type="number"
            className="form-control"
            id="remainingBalance"
            name="remainingBalance"
            value={loanData.remainingBalance}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={loanData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (id ? 'Update Loan' : 'Create Loan')}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;