const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: null,
    },
    quote: {
      type: String,
      default: 'No rest for me in this world. Perhaps in the next.',
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Pre-save: hash password ──────────────────────────────
userSchema.pre('save', async function () {
  // Only hash if password was modified
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Instance method: compare password ───────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: get public profile ─────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    quote: this.quote,
    coins: this.coins,
    level: this.level,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
