import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Error loading dashboard.</div>;
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Users</h3><p>{stats.totalUsers}</p></div>
        <div className="stat-card"><h3>Total Customers</h3><p>{stats.totalCustomers}</p></div>
        <div className="stat-card"><h3>Total Loans</h3><p>{stats.totalLoans}</p></div>
        <div className="stat-card"><h3>Active Loans</h3><p>{stats.activeLoans}</p></div>
        <div className="stat-card"><h3>Total Payments</h3><p>{stats.totalPayments}</p></div>
        <div className="stat-card"><h3>Pending Payments</h3><p>{stats.pendingPayments}</p></div>
        <div className="stat-card"><h3>Total Loan Amount</h3><p>₹{stats.totalLoanAmount?.toLocaleString('en-IN')}</p></div>
        <div className="stat-card"><h3>Collected Amount</h3><p>₹{stats.collectedAmount?.toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  );
};

export default AdminDashboard;