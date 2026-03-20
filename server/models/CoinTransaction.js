const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
