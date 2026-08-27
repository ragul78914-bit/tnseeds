const mongoose = require('mongoose');

const StockBatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true },
  seedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seed', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  quantity: { type: Number, required: true },
  mfgDate: { type: Date },
  expiryDate: { type: Date, required: true },
  purchaseDate: { type: Date, default: Date.now },
  supplier: { type: String, default: '' },
  costPrice: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'EXPIRING_SOON', 'EXPIRED'], 
    default: 'AVAILABLE' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockBatch', StockBatchSchema);
