const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  building: { type: String, default: '' },
  street: { type: String, default: '' },
  landmark: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  country: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
});

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isRedeemed: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  addresses: [addressSchema],
  coupons: [couponSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
