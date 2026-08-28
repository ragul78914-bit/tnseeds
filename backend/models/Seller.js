const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, ref: 'User', required: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  village: { type: String, default: '' },
  pincode: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  licenseNo: { type: String, required: true },
  gstNo: { type: String, default: '' },
  openingHours: { type: String, default: '8:00 AM - 8:00 PM' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', SellerSchema);
