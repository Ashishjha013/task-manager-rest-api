const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes and ensure user is authenticated via JWT token
const protect = async (req, res, next) => {
  // Get token from Authorization header
  let token = null;
  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, unauthorized access
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, token missing'));
  }

  try {
    // Verify token and decode user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    // Fetch user from database excluding password field
    const user = await User.findById(decoded.id).select('-password');
    // If user not found, unauthorized access
    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    return next(new Error('Not authorized, token invalid'));
  }
};

// Middleware to allow only admin users to access certain routes
const adminOnly = (req, res, next) => {
  // Check if user is attached to request and has admin role
  if (!req.user) {
    res.status(401);
    return next(new Error('Not authorized'));
  }
  // Check if user role is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    return next(new Error('Forbidden: Admins access only'));
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
};
