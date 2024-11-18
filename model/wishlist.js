const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
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
      addedAt: {
        type: Date, 
        default: Date.now  
      },
      isInWishlist: { 
        type: Boolean, 
        default: false  // Toggle field to mark if the product is actively in the wishlist
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
