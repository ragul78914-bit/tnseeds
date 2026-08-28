const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
  _id: { type: String },
  schemeName: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  requiredDocuments: { type: String, default: 'Aadhaar Card, Land Records (Patta/Chitta), Bank Passbook' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  officialLink: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
