const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  district: { type: String, default: 'Coimbatore' },
  taluk: { type: String, default: 'Coimbatore North' },
  village: { type: String, default: 'Perur' },
  latitude: { type: Number, default: 11.0168 },
  longitude: { type: Number, default: 76.9558 },
  searchHistory: [{ 
    keyword: String, 
    crop: String, 
    location: String, 
    date: { type: Date, default: Date.now } 
  }],
  favoriteSeeds: [{ type: String, ref: 'Seed' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
