const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['focus', 'reminder'],
    default: 'reminder',
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
