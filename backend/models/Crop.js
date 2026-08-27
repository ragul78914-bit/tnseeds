const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🌾' },
  season: { type: String, default: 'Kharif / Rabi' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', CropSchema);
