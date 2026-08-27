const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');
const Seller = require('../models/Seller');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

exports.getStockValuationReport = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller not found' });

      const inventories = store.inventories.filter(i => i.sellerId.toString() === seller._id.toString());
      const report = inventories.map(inv => {
        const seed = store.seeds.find(s => s._id.toString() === inv.seedId.toString()) || {};
        return {
          seedCode: seed.seedCode || 'N/A',
          seedName: seed.seedName || 'Unknown',
          crop: seed.crop || 'N/A',
          category: seed.category || 'N/A',
          currentStock: inv.currentStock,
          unit: inv.unit,
          purchasePrice: seed.purchasePrice || 0,
          sellingPrice: seed.sellingPrice || 0,
          totalCostValue: inv.currentStock * (seed.purchasePrice || 0),
          totalSalesValue: inv.currentStock * (seed.sellingPrice || 0),
          status: inv.status
        };
      });

      const totalValuation = report.reduce((sum, item) => sum + item.totalCostValue, 0);

      return res.json({
        seller: seller.businessName,
        generatedAt: new Date(),
        totalValuation,
        itemsCount: report.length,
        report
      });
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const inventories = await Inventory.find({ sellerId: seller._id }).populate('seedId');
    const report = inventories.map(inv => ({
      seedCode: inv.seedId ? inv.seedId.seedCode : 'N/A',
      seedName: inv.seedId ? inv.seedId.seedName : 'Unknown',
      crop: inv.seedId ? inv.seedId.crop : 'N/A',
      category: inv.seedId ? inv.seedId.category : 'N/A',
      currentStock: inv.currentStock,
      unit: inv.unit,
      purchasePrice: inv.seedId ? inv.seedId.purchasePrice : 0,
      sellingPrice: inv.seedId ? inv.seedId.sellingPrice : 0,
      totalCostValue: inv.currentStock * (inv.seedId ? inv.seedId.purchasePrice : 0),
      totalSalesValue: inv.currentStock * (inv.seedId ? inv.seedId.sellingPrice : 0),
      status: inv.status
    }));

    const totalValuation = report.reduce((sum, item) => sum + item.totalCostValue, 0);

    res.json({
      seller: seller.businessName,
      generatedAt: new Date(),
      totalValuation,
      itemsCount: report.length,
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockMovementReport = async (req, res) => {
  try {
    const user = req.user;
    const { fromDate, toDate, type } = req.query;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller not found' });

      let txns = store.transactions.filter(t => t.sellerId.toString() === seller._id.toString());
      if (type) {
        txns = txns.filter(t => t.type === type);
      }

      const report = txns.map(t => {
        const seed = store.seeds.find(s => s._id.toString() === t.seedId.toString()) || {};
        return {
          transactionNo: t.transactionNo,
          date: t.date,
          seedCode: seed.seedCode || 'N/A',
          seedName: seed.seedName || 'N/A',
          crop: seed.crop || 'N/A',
          type: t.type,
          quantity: t.quantity,
          unit: t.unit,
          price: t.price,
          totalAmount: t.quantity * t.price,
          oldStock: t.oldStock,
          newStock: t.newStock,
          notes: t.notes
        };
      });

      return res.json({
        seller: seller.businessName,
        generatedAt: new Date(),
        totalTransactions: report.length,
        report
      });
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const query = { sellerId: seller._id };
    if (type) query.type = type;

    const txns = await StockTransaction.find(query).populate('seedId').sort({ date: -1 });
    const report = txns.map(t => ({
      transactionNo: t.transactionNo,
      date: t.date,
      seedCode: t.seedId ? t.seedId.seedCode : 'N/A',
      seedName: t.seedId ? t.seedId.seedName : 'N/A',
      crop: t.seedId ? t.seedId.crop : 'N/A',
      type: t.type,
      quantity: t.quantity,
      unit: t.unit,
      price: t.price,
      totalAmount: t.quantity * t.price,
      oldStock: t.oldStock,
      newStock: t.newStock,
      notes: t.notes
    }));

    res.json({
      seller: seller.businessName,
      generatedAt: new Date(),
      totalTransactions: report.length,
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
