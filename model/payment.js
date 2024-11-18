const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'], required: true },
  transactionId: { type: String, required: true, unique: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed','Cancelled'], default: 'Pending' },
  paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
