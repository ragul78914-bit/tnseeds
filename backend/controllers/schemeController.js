const GovernmentScheme = require('../models/GovernmentScheme');
const AuditLog = require('../models/AuditLog');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

exports.getSchemes = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      return res.json(store.schemes);
    }

    const schemes = await GovernmentScheme.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const user = req.user;
    const { schemeName, department, description, eligibility, benefits, requiredDocuments, startDate, endDate, officialLink } = req.body;

    if (!schemeName || !department || !description || !eligibility || !benefits) {
      return res.status(400).json({ message: 'Please fill in all required scheme fields' });
    }

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const scheme = {
        _id: 'scheme_' + Date.now(),
        schemeName,
        department,
        description,
        eligibility,
        benefits,
        requiredDocuments: requiredDocuments || 'Aadhaar Card, Land Record (Patta/Chitta), Bank Account Details',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        officialLink: officialLink || 'https://tnagrisnet.tn.gov.in',
        status: 'ACTIVE',
        createdAt: new Date()
      };
      store.schemes.push(scheme);

      store.auditLogs.push({
        _id: 'audit_' + Date.now(),
        userId: user._id,
        userName: user.name,
        role: user.role,
        action: 'CREATED_GOVT_SCHEME',
        module: 'GOVERNMENT_SCHEMES',
        recordId: schemeName,
        newValue: `${schemeName} added under ${department}`,
        timestamp: new Date()
      });

      return res.status(201).json(scheme);
    }

    const scheme = await GovernmentScheme.create({
      schemeName,
      department,
      description,
      eligibility,
      benefits,
      requiredDocuments: requiredDocuments || 'Aadhaar Card, Land Record (Patta/Chitta), Bank Account Details',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      officialLink: officialLink || 'https://tnagrisnet.tn.gov.in',
      status: 'ACTIVE'
    });

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'CREATED_GOVT_SCHEME',
      module: 'GOVERNMENT_SCHEMES',
      recordId: schemeName,
      newValue: `${schemeName} added under ${department}`
    });

    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
