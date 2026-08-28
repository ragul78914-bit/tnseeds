const mongoose = require('mongoose');

const StockTransactionSchema = new mongoose.Schema({
  _id: { type: String },
  transactionNo: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  seedId: { type: String, ref: 'Seed', required: true },
  sellerId: { type: String, ref: 'Seller', required: true },
  type: { 
    type: String, 
    enum: ['PURCHASE', 'SALE', 'RETURN', 'DAMAGE', 'SHORTAGE', 'MANUAL_ADJUSTMENT', 'TRANSFER'],
    required: true 
  },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  price: { type: Number, default: 0 },
  oldStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  batchNumber: { type: String, default: '' },
  expiryDate: { type: Date },
  invoiceNo: { type: String, default: '' },
  supplier: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdBy: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockTransaction', StockTransactionSchema);
