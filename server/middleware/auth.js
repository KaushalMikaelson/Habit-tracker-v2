const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — JWT authentication middleware
 * Extracts Bearer token → verifies → attaches req.user
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // 3. Find user (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = { protect };
