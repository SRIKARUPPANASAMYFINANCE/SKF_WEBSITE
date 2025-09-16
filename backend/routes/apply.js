const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST api/apply
// @desc    Create a new loan application
// @access  Public
router.post('/', applyController.createApplication);

// @route   GET api/apply
// @desc    Get all loan applications
// @access  Private (Admin/Agent only)
router.get('/', authMiddleware, adminMiddleware, applyController.getApplications);

module.exports = router;