const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalLoans,
      activeLoans,
      totalPayments,
      pendingPayments
    ] = await Promise.all([
      User.countDocuments(),
      Customer.countDocuments(),
      Loan.countDocuments(),
      Loan.countDocuments({ status: 'active' }),
      Payment.countDocuments(),
      Payment.countDocuments({ status: 'pending' })
    ]);

    // Calculate total loan amount and collected amount
    const loanStats = await Loan.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$loanAmount' },
          collectedAmount: { $sum: '$collectedAmount' }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalCustomers,
      totalLoans,
      activeLoans,
      totalPayments,
      pendingPayments,
      totalLoanAmount: loanStats[0]?.totalAmount || 0,
      collectedAmount: loanStats[0]?.collectedAmount || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };

