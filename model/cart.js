const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      inCart: {
        type: Boolean,
        default: true  // Indicates that the product is currently in the cart
      }
    }
  ],
  totalQuantity: {
    type: Number,
    default: 0  // Auto-updated based on the items in the cart
  },
  totalPrice: {
    type: Number,
    default: 0  // Auto-updated based on item prices and quantities
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);