const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    building:String,
    street: String,
    landmark:String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed',"Refunded"], default: 'Pending' },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  orderedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
