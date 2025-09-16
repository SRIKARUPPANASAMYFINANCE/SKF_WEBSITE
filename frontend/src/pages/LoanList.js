import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { deleteLoan } from '../services/api'; // Import deleteLoan

const Loans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan(id);
        fetchLoans(); // Refresh the list
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans');
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      closed: 'status-closed',
      defaulted: 'status-defaulted'
    };
    
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>Loans</h2>
      <Link to="/new-loan" className="btn btn-primary">Create New Loan</Link>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Loan Amount</th>
              <th>Interest</th>
              <th>Total Repayable</th>
              <th>Loan Type</th>
              <th>Installment</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Remaining Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan._id}>
                <td>{loan.customer?.name}</td>
                <td>₹{loan.loanAmount?.toLocaleString('en-IN')}</td>
                <td>{loan.interestRate}%</td>
                <td>₹{loan.totalRepayable?.toLocaleString('en-IN')}</td>
                <td>{loan.loanType}</td>
                <td>₹{loan.installment?.toLocaleString('en-IN')}</td>
                <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                <td>{new Date(loan.endDate).toLocaleDateString()}</td>
                <td>{getStatusBadge(loan.status)}</td>
                <td>₹{loan.remainingBalance?.toLocaleString('en-IN')}</td>
                <td>
                  <Link to={`/loans/${loan._id}`} className="btn btn-sm btn-info">View</Link>
                  <Link to={`/loans/edit/${loan._id}`} className="btn btn-sm btn-warning">Edit</Link>
                  <button onClick={() => handleDelete(loan._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;