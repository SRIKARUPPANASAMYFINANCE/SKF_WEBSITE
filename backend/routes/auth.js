const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUsers, makeAdmin } = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST api/auth/make-admin
// @desc    Make a user an admin
// @access  Public (for now)
router.post('/make-admin', makeAdmin);

// @route   GET api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', authMiddleware, getMe);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', authMiddleware, adminMiddleware, getUsers);

module.exports = router;