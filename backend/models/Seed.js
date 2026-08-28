const mongoose = require('mongoose');

const SeedSchema = new mongoose.Schema({
  _id: { type: String },
  seedCode: { type: String, required: true, unique: true },
  seedName: { type: String, required: true },
  crop: { type: String, required: true },
  category: { type: String, required: true, default: 'Hybrid Seed' },
  variety: { type: String, required: true },
  hybridName: { type: String, default: '' },
  brand: { type: String, required: true },
  hsnCode: { type: String, default: '12099990' },
  unit: { type: String, enum: ['kg', 'grams', 'packet', 'bag'], default: 'kg' },
  packSize: { type: String, default: '1 kg' },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  gstPercent: { type: Number, default: 0 },
  openingQuantity: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 20 },
  maxStockLevel: { type: Number, default: 1000 },
  supplier: { type: String, default: '' },
  description: { type: String, default: '' },
  suitableSeason: { type: String, default: 'Kharif & Rabi' },
  recommendedRegion: { type: String, default: 'Tamil Nadu & South India' },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  sellerId: { type: String, ref: 'Seller', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seed', SeedSchema);
