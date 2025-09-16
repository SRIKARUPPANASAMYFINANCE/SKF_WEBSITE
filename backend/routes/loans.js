const express = require('express');
const router = express.Router();
const { createLoan, getLoans, getLoanById, deleteLoan, updateLoan, calculateLoan } = require('../controllers/loanController');

// @route   GET api/loans/calculate
// @desc    Calculate loan details
// @access  Public
router.get('/calculate', calculateLoan);

// Create a new loan
router.post('/', createLoan);

module.exports = router;