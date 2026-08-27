const Seller = require('../models/Seller');
const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');
const Supplier = require('../models/Supplier');
const AuditLog = require('../models/AuditLog');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

exports.getSellerDashboard = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const seeds = store.seeds.filter(s => s.sellerId.toString() === seller._id.toString());
      const seedIds = seeds.map(s => s._id.toString());
      const inventories = store.inventories.filter(i => i.sellerId.toString() === seller._id.toString());

      const totalSeeds = seeds.length;
      let totalStockKg = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let totalStockValue = 0;

      const lowStockSeeds = [];
      const stockByCropMap = {};

      inventories.forEach(inv => {
        const seed = seeds.find(s => s._id.toString() === inv.seedId.toString());
        totalStockKg += inv.currentStock;
        totalStockValue += inv.stockValue;

        if (inv.status === 'LOW_STOCK') {
          lowStockCount++;
          if (seed) lowStockSeeds.push({ seedName: seed.seedName, crop: seed.crop, currentStock: inv.currentStock, minStockLevel: seed.minStockLevel, unit: seed.unit });
        } else if (inv.status === 'OUT_OF_STOCK') {
          outOfStockCount++;
          if (seed) lowStockSeeds.push({ seedName: seed.seedName, crop: seed.crop, currentStock: 0, minStockLevel: seed.minStockLevel, unit: seed.unit });
        }

        if (seed) {
          stockByCropMap[seed.crop] = (stockByCropMap[seed.crop] || 0) + inv.currentStock;
        }
      });

      // Today's transactions
      const todayStr = new Date().toISOString().slice(0, 10);
      const sellerTxns = store.transactions.filter(t => t.sellerId.toString() === seller._id.toString());

      let todayPurchases = 0;
      let todaySales = 0;

      sellerTxns.forEach(t => {
        const tDate = new Date(t.date).toISOString().slice(0, 10);
        if (tDate === todayStr) {
          if (t.type === 'PURCHASE') todayPurchases += t.quantity * t.price;
          else if (t.type === 'SALE') todaySales += t.quantity * t.price;
        }
      });

      // Stock by Crop chart data
      const stockByCrop = Object.keys(stockByCropMap).map(crop => ({
        crop,
        stock: stockByCropMap[crop]
      }));

      // Monthly sales & purchase chart data
      const monthlyData = [
        { month: 'Jan', purchases: 45000, sales: 52000 },
        { month: 'Feb', purchases: 38000, sales: 49000 },
        { month: 'Mar', purchases: 62000, sales: 71000 },
        { month: 'Apr', purchases: 55000, sales: 68000 },
        { month: 'May', purchases: 70000, sales: 85000 },
        { month: 'Jun', purchases: 48000, sales: 62000 },
        { month: 'Jul', purchases: 52000, sales: 59000 },
        { month: 'Aug', purchases: todayPurchases || 45500, sales: todaySales || 28750 }
      ];

      return res.json({
        metrics: {
          totalSeeds,
          totalStockKg,
          lowStockCount,
          outOfStockCount,
          todayPurchases,
          todaySales,
          totalStockValue
        },
        stockByCrop,
        monthlyData,
        lowStockSeeds
      });
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const seeds = await Seed.find({ sellerId: seller._id });
    const inventories = await Inventory.find({ sellerId: seller._id }).populate('seedId');

    const totalSeeds = seeds.length;
    let totalStockKg = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalStockValue = 0;
    const lowStockSeeds = [];
    const stockByCropMap = {};

    inventories.forEach(inv => {
      totalStockKg += inv.currentStock;
      totalStockValue += inv.stockValue;

      if (inv.status === 'LOW_STOCK') {
        lowStockCount++;
        if (inv.seedId) lowStockSeeds.push({ seedName: inv.seedId.seedName, crop: inv.seedId.crop, currentStock: inv.currentStock, minStockLevel: inv.seedId.minStockLevel, unit: inv.unit });
      } else if (inv.status === 'OUT_OF_STOCK') {
        outOfStockCount++;
        if (inv.seedId) lowStockSeeds.push({ seedName: inv.seedId.seedName, crop: inv.seedId.crop, currentStock: 0, minStockLevel: inv.seedId.minStockLevel, unit: inv.unit });
      }

      if (inv.seedId) {
        stockByCropMap[inv.seedId.crop] = (stockByCropMap[inv.seedId.crop] || 0) + inv.currentStock;
      }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayTxns = await StockTransaction.find({ sellerId: seller._id, date: { $gte: todayStart } });
    let todayPurchases = 0;
    let todaySales = 0;

    todayTxns.forEach(t => {
      if (t.type === 'PURCHASE') todayPurchases += t.quantity * t.price;
      else if (t.type === 'SALE') todaySales += t.quantity * t.price;
    });

    const stockByCrop = Object.keys(stockByCropMap).map(crop => ({ crop, stock: stockByCropMap[crop] }));
    const monthlyData = [
      { month: 'Jan', purchases: 45000, sales: 52000 },
      { month: 'Feb', purchases: 38000, sales: 49000 },
      { month: 'Mar', purchases: 62000, sales: 71000 },
      { month: 'Apr', purchases: 55000, sales: 68000 },
      { month: 'May', purchases: 70000, sales: 85000 },
      { month: 'Jun', purchases: 48000, sales: 62000 },
      { month: 'Jul', purchases: 52000, sales: 59000 },
      { month: 'Aug', purchases: todayPurchases || 45500, sales: todaySales || 28750 }
    ];

    res.json({
      metrics: {
        totalSeeds,
        totalStockKg,
        lowStockCount,
        outOfStockCount,
        todayPurchases,
        todaySales,
        totalStockValue
      },
      stockByCrop,
      monthlyData,
      lowStockSeeds
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerProfile = async (req, res) => {
  try {
    const user = req.user;
    const { businessName, ownerName, phone, address, district, taluk, village, pincode, latitude, longitude, openingHours, licenseNo, gstNo } = req.body;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      if (businessName) seller.businessName = businessName;
      if (ownerName) seller.ownerName = ownerName;
      if (phone) seller.phone = phone;
      if (address) seller.address = address;
      if (district) seller.district = district;
      if (taluk) seller.taluk = taluk;
      if (village) seller.village = village;
      if (pincode) seller.pincode = pincode;
      if (latitude) seller.latitude = parseFloat(latitude);
      if (longitude) seller.longitude = parseFloat(longitude);
      if (openingHours) seller.openingHours = openingHours;
      if (licenseNo) seller.licenseNo = licenseNo;
      if (gstNo) seller.gstNo = gstNo;

      return res.json(seller);
    }

    const seller = await Seller.findOneAndUpdate(
      { userId: user._id },
      { $set: req.body },
      { new: true }
    );

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suppliers Management
exports.getSuppliers = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller not found' });

      const suppliers = store.suppliers.filter(sup => sup.sellerId.toString() === seller._id.toString());
      return res.json(suppliers);
    }

    const seller = await Seller.findOne({ userId: user._id });
    const suppliers = await Supplier.find({ sellerId: seller._id });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSupplier = async (req, res) => {
  try {
    const user = req.user;
    const { supplierName, contactPerson, phone, email, address, gstNumber, pan } = req.body;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller not found' });

      const count = store.suppliers.length;
      const supplierCode = `SUP-${(count + 1).toString().padStart(4, '0')}`;
      const supplier = {
        _id: 'sup_' + Date.now(),
        sellerId: seller._id,
        supplierCode,
        supplierName,
        contactPerson: contactPerson || '',
        phone: phone || '',
        email: email || '',
        address: address || '',
        gstNumber: gstNumber || '',
        pan: pan || '',
        totalPurchases: 0,
        status: 'ACTIVE',
        createdAt: new Date()
      };

      store.suppliers.push(supplier);
      return res.status(201).json(supplier);
    }

    const seller = await Seller.findOne({ userId: user._id });
    const count = await Supplier.countDocuments();
    const supplierCode = `SUP-${(count + 1).toString().padStart(4, '0')}`;

    const supplier = await Supplier.create({
      sellerId: seller._id,
      supplierCode,
      supplierName,
      contactPerson,
      phone,
      email,
      address,
      gstNumber,
      pan
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
