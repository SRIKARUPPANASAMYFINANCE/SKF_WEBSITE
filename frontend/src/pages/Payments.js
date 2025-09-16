import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const deletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await api.delete(`/payments/${id}`);
        fetchPayments(); // Refresh the list
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>Payments</h2>
      <Link to="/new-payment" className="btn btn-primary">Add New Payment</Link>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.loan?.loanAmount}</td>
                <td>₹{payment.amount?.toLocaleString('en-IN')}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>
                  <Link to={`/edit-payment/${payment._id}`} className="btn btn-secondary">Edit</Link>
                  <button onClick={() => deletePayment(payment._id)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;