const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign JWT ─────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

// ── Helper: send token response ──────────────────────────
const sendTokenResponse = (res, statusCode, user) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toPublicJSON(),
  });
};

// ────────────────────────────────────────────────────────
// POST /api/auth/signup
// ────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    sendTokenResponse(res, 201, user);
  } catch (err) {
    console.error('Signup error:', err.message);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already in use.' });
    }
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user with password (select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    sendTokenResponse(res, 200, user);
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.user is already attached by protect middleware
    res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (err) {
    console.error('getMe error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};
