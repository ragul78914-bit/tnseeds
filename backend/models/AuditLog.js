const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, ref: 'User' },
  userName: { type: String, default: 'System' },
  role: { type: String, default: 'SYSTEM' },
  action: { type: String, required: true },
  module: { type: String, required: true },
  recordId: { type: String, default: '' },
  oldValue: { type: String, default: '' },
  newValue: { type: String, default: '' },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
