const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  _id: { type: String },
  seedId: { type: String, ref: 'Seed', required: true },
  sellerId: { type: String, ref: 'Seller', required: true },
  openingStock: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  damaged: { type: Number, default: 0 },
  shortage: { type: Number, default: 0 },
  adjustmentsIn: { type: Number, default: 0 },
  adjustmentsOut: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  stockValue: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK'], 
    default: 'OUT_OF_STOCK' 
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);
