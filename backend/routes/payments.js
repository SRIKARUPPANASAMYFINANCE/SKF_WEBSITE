const express = require('express');
const router = express.Router();
const { getPayments, createPayment, updatePayment, deletePayment, getPaymentsByLoanId } = require('../controllers/paymentController');

// Get all payments
router.get('/', getPayments);

// Create a new payment
router.post('/', createPayment);

// Update a payment
router.patch('/:id', updatePayment);

// Delete a payment
router.delete('/:id', deletePayment);

// Get payments for a specific loan
router.get('/loan/:loanId', getPaymentsByLoanId);

module.exports = router;