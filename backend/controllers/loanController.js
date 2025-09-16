const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const { loanInterestRate, loanTenureWeeks } = require('../config/appConfig');

// Create a new loan
const createLoan = async (req, res) => {
  try {
    const { customerId, loanAmount, startDate, loanType } = req.body;
    
    let tenure, tenureUnit, installment;
    const interestRate = loanInterestRate;

    if (loanType === 'monthly') {
      tenure = 4; // 4 months
      tenureUnit = 'months';
    } else {
      tenure = 10; // 10 weeks
      tenureUnit = 'weeks';
    }

    // Calculate loan details
    const totalInterest = loanAmount * (interestRate / 100);
    const totalRepayable = loanAmount + totalInterest;
    if (tenureUnit === 'weeks') {
      installment = totalRepayable / tenure;
    } else if (tenureUnit === 'months') {
      installment = totalRepayable / tenure;
    }
    
    // Calculate end date
    const endDate = new Date(startDate);
    if (tenureUnit === 'weeks') {
      endDate.setDate(endDate.getDate() + (tenure * 7));
    } else if (tenureUnit === 'months') {
      endDate.setMonth(endDate.getMonth() + tenure);
    }
    
    const loan = new Loan({
      customer: customerId,
      loanAmount,
      interestRate,
      tenure,
      tenureUnit,
      startDate,
      endDate,
      totalRepayable,
      installment,
      remainingBalance: totalRepayable,
      loanType
    });
    
    await loan.save();
    
    // Populate customer details before sending response
    await loan.populate('customer');
    
    res.status(201).json({ message: 'Loan created successfully', loan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all loans
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('customer');
    res.json({ message: 'Loans fetched successfully', loans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific loan
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('customer');
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json({ message: 'Loan fetched successfully', loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a loan
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    await Loan.deleteOne({ _id: req.params.id });
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a loan
const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('customer');
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    res.json({ message: 'Loan updated successfully', loan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Calculate loan details
const calculateLoan = async (req, res) => {
  try {
    const { principal, interestRate, tenureWeeks } = req.query;

    if (!principal || !interestRate || !tenureWeeks) {
      return res.status(400).json({ message: 'Missing principal, interestRate, or tenureWeeks' });
    }

    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100; // Convert percentage to decimal
    const w = parseInt(tenureWeeks);

    if (isNaN(p) || isNaN(r) || isNaN(w) || p <= 0 || r < 0 || w <= 0) {
      return res.status(400).json({ message: 'Invalid input for calculation' });
    }

    const totalInterest = p * r;
    const totalRepayable = p + totalInterest;
    const weeklyInstallment = totalRepayable / w;

    res.json({
      totalInterest: totalInterest.toFixed(2),
      totalRepayable: totalRepayable.toFixed(2),
      weeklyInstallment: weeklyInstallment.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  deleteLoan,
  updateLoan,
  calculateLoan
};