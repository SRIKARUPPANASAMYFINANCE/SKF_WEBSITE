const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    default: 25 // 25% for 10 weeks
  },
  tenure: {
    type: Number,
    default: 10 // 10 weeks or 4 months
  },
  tenureUnit: {
    type: String,
    enum: ['weeks', 'months'],
    default: 'weeks'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalRepayable: {
    type: Number,
    required: true
  },
  installment: {
    type: Number,
    required: true
  },
  loanType: {
    type: String,
    enum: ['weekly', 'monthly'],
    default: 'weekly'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'defaulted'],
    default: 'active'
  },
  remainingBalance: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', LoanSchema);