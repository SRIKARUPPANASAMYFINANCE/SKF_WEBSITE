const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a-very-secret-key-for-development');
    
    // Find user and exclude password
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ msg: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin role middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  }
 else {
    res.status(403).json({ msg: 'Access denied. Admin rights required.' });
  }
};

// Staff or Admin role middleware
const staffMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    next();
  }
 else {
    res.status(403).json({ msg: 'Access denied. Staff or Admin rights required.' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  staffMiddleware
};