const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['health', 'learning', 'productivity', 'mindfulness', 'fitness', 'custom'],
      default: 'custom',
    },
    color: {
      type: String,
      default: '#00ff88', // hex color
    },
    icon: {
      type: String,
      default: '⭐', // emoji
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    targetDays: {
      type: [Number],
      default: [], // 0=Sun to 6=Sat, used only if frequency is custom
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);
