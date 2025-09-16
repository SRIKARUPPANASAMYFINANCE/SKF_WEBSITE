const express = require('express');
const router = express.Router();
const { authMiddleware, staffMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController');

// @route   GET api/customers
// @desc    Get all customers
// @access  Private (Staff/Admin only)
router.get('/', authMiddleware, staffMiddleware, customerController.getCustomers);

// @route   GET api/customers/:id
// @desc    Get customer by ID
// @access  Private (Staff/Admin only)
router.get('/:id', authMiddleware, staffMiddleware, customerController.getCustomerById);

// @route   POST api/customers
// @desc    Create a customer
// @access  Private (Staff/Admin only)
router.post('/', authMiddleware, staffMiddleware, customerController.createCustomer);

// @route   PUT api/customers/:id
// @desc    Update a customer
// @access  Private (Staff/Admin only)
router.put('/:id', authMiddleware, staffMiddleware, customerController.updateCustomer);

// @route   DELETE api/customers/:id
// @desc    Delete a customer
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, customerController.deleteCustomer);

module.exports = router;
