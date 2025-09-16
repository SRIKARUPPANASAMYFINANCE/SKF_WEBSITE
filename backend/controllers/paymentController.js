const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('loan');
    res.json({ message: 'Payments fetched successfully', payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { loanId, amount, paymentDate } = req.body;
    
    // Find the loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Create payment
    const payment = new Payment({
      loan: loanId,
      amount,
      paymentDate: paymentDate || new Date()
    });
    
    await payment.save();
    
    // Update loan balance
    loan.remainingBalance -= amount;
    
    // If balance is zero or less, mark loan as closed
    if (loan.remainingBalance <= 0) {
      loan.status = 'closed';
    }
    
    await loan.save();
    
    // Populate loan details before sending response
    await payment.populate('loan');
    
    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a payment
const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.body.amount != null) {
      payment.amount = req.body.amount;
    }
    if (req.body.paymentDate != null) {
      payment.paymentDate = req.body.paymentDate;
    }

    const updatedPayment = await payment.save();
    res.json({ message: 'Payment updated successfully', payment: updatedPayment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments for a specific loan
const getPaymentsByLoanId = async (req, res) => {
  try {
    const payments = await Payment.find({ loan: req.params.loanId }).populate('loan');
    res.json({ message: 'Payments fetched successfully', payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByLoanId
};