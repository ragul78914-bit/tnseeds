const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Seller = require('../models/Seller');
const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const GovernmentScheme = require('../models/GovernmentScheme');
const AuditLog = require('../models/AuditLog');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

exports.getAdminDashboard = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const totalFarmers = store.farmers.length;
      const totalSellers = store.sellers.length;
      const activeSellers = store.sellers.filter(s => s.status === 'ACTIVE').length;
      const totalSeeds = store.seeds.length;

      let totalStockKg = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;

      store.inventories.forEach(inv => {
        totalStockKg += inv.currentStock;
        if (inv.status === 'LOW_STOCK') lowStockCount++;
        if (inv.status === 'OUT_OF_STOCK') outOfStockCount++;
      });

      // District wise seller count
      const districtMap = {};
      store.sellers.forEach(s => {
        districtMap[s.district] = (districtMap[s.district] || 0) + 1;
      });
      const districtDistribution = Object.keys(districtMap).map(d => ({ district: d, count: districtMap[d] }));

      // Crop wise available stock
      const cropStockMap = {};
      store.inventories.forEach(inv => {
        const seed = store.seeds.find(s => s._id.toString() === inv.seedId.toString());
        if (seed) {
          cropStockMap[seed.crop] = (cropStockMap[seed.crop] || 0) + inv.currentStock;
        }
      });
      const cropDistribution = Object.keys(cropStockMap).map(c => ({ crop: c, stock: cropStockMap[c] }));

      return res.json({
        metrics: {
          totalFarmers,
          totalSellers,
          activeSellers,
          totalSeeds,
          totalStockKg,
          lowStockCount,
          outOfStockCount,
          totalSchemes: store.schemes.length
        },
        districtDistribution,
        cropDistribution,
        recentLogs: store.auditLogs.slice(-10).reverse()
      });
    }

    const totalFarmers = await Farmer.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const activeSellers = await Seller.countDocuments({ status: 'ACTIVE' });
    const totalSeeds = await Seed.countDocuments();

    const inventories = await Inventory.find({}).populate('seedId');
    let totalStockKg = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const cropStockMap = {};

    inventories.forEach(inv => {
      totalStockKg += inv.currentStock;
      if (inv.status === 'LOW_STOCK') lowStockCount++;
      if (inv.status === 'OUT_OF_STOCK') outOfStockCount++;
      if (inv.seedId) {
        cropStockMap[inv.seedId.crop] = (cropStockMap[inv.seedId.crop] || 0) + inv.currentStock;
      }
    });

    const sellers = await Seller.find({});
    const districtMap = {};
    sellers.forEach(s => {
      districtMap[s.district] = (districtMap[s.district] || 0) + 1;
    });

    const districtDistribution = Object.keys(districtMap).map(d => ({ district: d, count: districtMap[d] }));
    const cropDistribution = Object.keys(cropStockMap).map(c => ({ crop: c, stock: cropStockMap[c] }));
    const recentLogs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(10);

    res.json({
      metrics: {
        totalFarmers,
        totalSellers,
        activeSellers,
        totalSeeds,
        totalStockKg,
        lowStockCount,
        outOfStockCount,
        totalSchemes: await GovernmentScheme.countDocuments()
      },
      districtDistribution,
      cropDistribution,
      recentLogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Seller Active / Inactive Status
exports.toggleSellerStatus = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const adminUser = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s._id.toString() === sellerId.toString());
      if (!seller) return res.status(404).json({ message: 'Seller not found' });

      seller.status = seller.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      // Also toggle corresponding User status if deactivated
      const user = store.users.find(u => u._id.toString() === seller.userId.toString());
      if (user) user.status = seller.status;

      store.auditLogs.push({
        _id: 'audit_' + Date.now(),
        userId: adminUser._id,
        userName: adminUser.name,
        role: adminUser.role,
        action: 'TOGGLE_SELLER_STATUS',
        module: 'ADMIN_SELLER_MANAGEMENT',
        recordId: seller.businessName,
        newValue: `Status changed to ${seller.status}`,
        timestamp: new Date()
      });

      return res.json({ message: `Seller ${seller.businessName} is now ${seller.status}`, seller });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    seller.status = seller.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await seller.save();

    await User.findByIdAndUpdate(seller.userId, { status: seller.status });

    await AuditLog.create({
      userId: adminUser._id,
      userName: adminUser.name,
      role: adminUser.role,
      action: 'TOGGLE_SELLER_STATUS',
      module: 'ADMIN_SELLER_MANAGEMENT',
      recordId: seller.businessName,
      newValue: `Status changed to ${seller.status}`
    });

    res.json({ message: `Seller ${seller.businessName} is now ${seller.status}`, seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const result = store.sellers.map(s => {
        const seedCount = store.seeds.filter(seed => seed.sellerId.toString() === s._id.toString()).length;
        return { ...s, seedCount };
      });
      return res.json(result);
    }

    const sellers = await Seller.find({}).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      return res.json(store.farmers);
    }

    const farmers = await Farmer.find({}).sort({ createdAt: -1 });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      return res.json(store.auditLogs.slice().reverse());
    }

    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
