const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      if (!req.user) throw new Error('User not found');
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized'
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      error: 'No authorization token' 
    });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ 
    success: false,
    error: 'Admin access required' 
  });
};

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err && decoded?.id) {
        req.user = await User.findByPk(decoded.id);
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = { protect, admin, optionalAuth };
