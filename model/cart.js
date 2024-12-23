
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
      size: {   // Size field added here
        type: String,
        required: true  // Ensure size is required
      },
      color: {   // color field added here
        type: String,
        required: true  // Ensure size is required
      },
      inCart: {
        type: Boolean,
        default: true
      }
    }
  ],
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
