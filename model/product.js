// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',  // Reference to Category model
      required: true 
    },
    brand: { type: String, trim: true },
    discountPrice: { type: Number, required: true, min: 0 },
    mrpPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, unique: true, required: true },
    images: [{ url: { type: String, required: true }, altText: String }],
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      default: ["M"],
    },
    colors: [String],
    fabric: {
      type: String,
      enum: ["Cotton", "Silk", "Georgette", "Rayon", "Linen"],
      default: "Cotton",
    },
    productReturnDay: {
      type: Number,
      required: true,
      default: 2,
    },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    ratings: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      numberOfRatings: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
