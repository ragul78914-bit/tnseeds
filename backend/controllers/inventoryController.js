const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');
const StockBatch = require('../models/StockBatch');
const Seller = require('../models/Seller');
const AuditLog = require('../models/AuditLog');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

// Helper to generate transaction number
const generateTxnNo = (count) => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = (count + 1).toString().padStart(4, '0');
  return `TXN-${dateStr}-${seq}`;
};

// Main Stock Entry / Transaction Update Endpoint
exports.createStockTransaction = async (req, res) => {
  try {
    const user = req.user;
    const {
      seedId,
      type, // 'PURCHASE', 'SALE', 'RETURN', 'DAMAGE', 'SHORTAGE', 'MANUAL_ADJUSTMENT', 'TRANSFER'
      quantity,
      batchNumber = '',
      expiryDate = null,
      invoiceNo = '',
      supplier = '',
      notes = ''
    } = req.body;

    const qty = parseFloat(quantity);
    if (!seedId || !type || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Please provide valid seedId, transaction type, and positive quantity' });
    }

    const io = req.app.get('socketio');

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const seed = store.seeds.find(s => s._id.toString() === seedId.toString());
      if (!seed) return res.status(404).json({ message: 'Seed product not found' });

      let inventory = store.inventories.find(i => i.seedId.toString() === seedId.toString());
      if (!inventory) {
        inventory = {
          _id: 'inv_' + Date.now(),
          seedId,
          sellerId: seller._id,
          openingStock: 0,
          purchased: 0,
          sold: 0,
          damaged: 0,
          shortage: 0,
          adjustmentsIn: 0,
          adjustmentsOut: 0,
          currentStock: 0,
          unit: seed.unit,
          stockValue: 0,
          status: 'OUT_OF_STOCK',
          lastUpdated: new Date()
        };
        store.inventories.push(inventory);
      }

      const oldStock = inventory.currentStock;
      let newStock = oldStock;

      // Apply Stock Logic & Validate Negative Stock
      if (['PURCHASE', 'RETURN', 'ADJUSTMENT_IN'].includes(type)) {
        newStock = oldStock + qty;
        if (type === 'PURCHASE') inventory.purchased += qty;
        else if (type === 'ADJUSTMENT_IN') inventory.adjustmentsIn += qty;
      } else if (['SALE', 'DAMAGE', 'SHORTAGE', 'ADJUSTMENT_OUT'].includes(type)) {
        if (oldStock < qty) {
          return res.status(400).json({ 
            message: `Insufficient stock available. Current stock: ${oldStock} ${seed.unit}, Requested: ${qty} ${seed.unit}` 
          });
        }
        newStock = oldStock - qty;
        if (type === 'SALE') inventory.sold += qty;
        else if (type === 'DAMAGE') inventory.damaged += qty;
        else if (type === 'SHORTAGE') inventory.shortage += qty;
        else if (type === 'ADJUSTMENT_OUT') inventory.adjustmentsOut += qty;
      } else {
        return res.status(400).json({ message: 'Invalid stock transaction type' });
      }

      // Update Inventory state
      inventory.currentStock = newStock;
      inventory.stockValue = newStock * seed.purchasePrice;
      inventory.lastUpdated = new Date();

      if (newStock > seed.minStockLevel) {
        inventory.status = 'AVAILABLE';
      } else if (newStock > 0 && newStock <= seed.minStockLevel) {
        inventory.status = 'LOW_STOCK';
      } else {
        inventory.status = 'OUT_OF_STOCK';
      }

      // Record Stock Transaction
      const txnNo = generateTxnNo(store.transactions.length);
      const transaction = {
        _id: 'txn_' + Date.now(),
        transactionNo: txnNo,
        date: new Date(),
        seedId,
        sellerId: seller._id,
        type,
        quantity: qty,
        unit: seed.unit,
        price: type === 'SALE' ? seed.sellingPrice : seed.purchasePrice,
        oldStock,
        newStock,
        batchNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        invoiceNo,
        supplier,
        notes,
        createdBy: user._id,
        createdAt: new Date()
      };
      store.transactions.push(transaction);

      // Record Batch if provided
      if (batchNumber && type === 'PURCHASE') {
        store.batches.push({
          _id: 'batch_' + Date.now(),
          batchNumber,
          seedId,
          sellerId: seller._id,
          quantity: qty,
          mfgDate: new Date(),
          expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(),
          supplier,
          costPrice: seed.purchasePrice,
          status: 'AVAILABLE',
          createdAt: new Date()
        });
      }

      // Audit Log
      store.auditLogs.push({
        _id: 'audit_' + Date.now(),
        userId: user._id,
        userName: user.name,
        role: user.role,
        action: `STOCK_${type}`,
        module: 'INVENTORY',
        recordId: txnNo,
        oldValue: `${oldStock} ${seed.unit}`,
        newValue: `${newStock} ${seed.unit}`,
        timestamp: new Date()
      });

      // WebSocket Broadcast for Real-Time Availability
      if (io) {
        io.emit('stock_updated', {
          seedId,
          seedName: seed.seedName,
          sellerId: seller._id,
          sellerName: seller.businessName,
          oldStock,
          newStock,
          unit: seed.unit,
          status: inventory.status,
          updatedAt: inventory.lastUpdated
        });
      }

      return res.status(201).json({
        message: 'Stock transaction created successfully',
        transaction,
        inventory,
        seedName: seed.seedName
      });
    }

    // Mongoose Engine
    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const seed = await Seed.findById(seedId);
    if (!seed) return res.status(404).json({ message: 'Seed product not found' });

    let inventory = await Inventory.findOne({ seedId });
    if (!inventory) {
      inventory = await Inventory.create({
        seedId: seed._id,
        sellerId: seller._id,
        openingStock: 0,
        currentStock: 0,
        unit: seed.unit,
        status: 'OUT_OF_STOCK'
      });
    }

    const oldStock = inventory.currentStock;
    let newStock = oldStock;

    if (['PURCHASE', 'RETURN', 'ADJUSTMENT_IN'].includes(type)) {
      newStock = oldStock + qty;
      if (type === 'PURCHASE') inventory.purchased += qty;
      else if (type === 'ADJUSTMENT_IN') inventory.adjustmentsIn += qty;
    } else if (['SALE', 'DAMAGE', 'SHORTAGE', 'ADJUSTMENT_OUT'].includes(type)) {
      if (oldStock < qty) {
        return res.status(400).json({ 
          message: `Insufficient stock available. Current stock: ${oldStock} ${seed.unit}, Requested: ${qty} ${seed.unit}` 
        });
      }
      newStock = oldStock - qty;
      if (type === 'SALE') inventory.sold += qty;
      else if (type === 'DAMAGE') inventory.damaged += qty;
      else if (type === 'SHORTAGE') inventory.shortage += qty;
      else if (type === 'ADJUSTMENT_OUT') inventory.adjustmentsOut += qty;
    }

    inventory.currentStock = newStock;
    inventory.stockValue = newStock * seed.purchasePrice;
    inventory.lastUpdated = new Date();

    if (newStock > seed.minStockLevel) {
      inventory.status = 'AVAILABLE';
    } else if (newStock > 0 && newStock <= seed.minStockLevel) {
      inventory.status = 'LOW_STOCK';
    } else {
      inventory.status = 'OUT_OF_STOCK';
    }

    await inventory.save();

    const count = await StockTransaction.countDocuments();
    const txnNo = generateTxnNo(count);

    const transaction = await StockTransaction.create({
      transactionNo: txnNo,
      seedId: seed._id,
      sellerId: seller._id,
      type,
      quantity: qty,
      unit: seed.unit,
      price: type === 'SALE' ? seed.sellingPrice : seed.purchasePrice,
      oldStock,
      newStock,
      batchNumber,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      invoiceNo,
      supplier,
      notes,
      createdBy: user._id
    });

    if (batchNumber && type === 'PURCHASE') {
      await StockBatch.create({
        batchNumber,
        seedId: seed._id,
        sellerId: seller._id,
        quantity: qty,
        expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        supplier,
        costPrice: seed.purchasePrice
      });
    }

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: `STOCK_${type}`,
      module: 'INVENTORY',
      recordId: txnNo,
      oldValue: `${oldStock} ${seed.unit}`,
      newValue: `${newStock} ${seed.unit}`
    });

    if (io) {
      io.emit('stock_updated', {
        seedId: seed._id,
        seedName: seed.seedName,
        sellerId: seller._id,
        sellerName: seller.businessName,
        oldStock,
        newStock,
        unit: seed.unit,
        status: inventory.status,
        updatedAt: inventory.lastUpdated
      });
    }

    res.status(201).json({
      message: 'Stock transaction created successfully',
      transaction,
      inventory,
      seedName: seed.seedName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Inventory Table
exports.getInventoryTable = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const inventories = store.inventories.filter(i => i.sellerId.toString() === seller._id.toString());
      const table = inventories.map(inv => {
        const seed = store.seeds.find(s => s._id.toString() === inv.seedId.toString()) || {};
        return {
          _id: inv._id,
          seedCode: seed.seedCode || 'N/A',
          seedName: seed.seedName || 'Unknown',
          crop: seed.crop || 'N/A',
          category: seed.category || 'N/A',
          openingStock: inv.openingStock,
          purchased: inv.purchased,
          sold: inv.sold,
          damaged: inv.damaged,
          shortage: inv.shortage,
          adjustmentsIn: inv.adjustmentsIn,
          adjustmentsOut: inv.adjustmentsOut,
          currentStock: inv.currentStock,
          minStockLevel: seed.minStockLevel || 20,
          unit: inv.unit,
          stockValue: inv.stockValue,
          status: inv.status,
          lastUpdated: inv.lastUpdated
        };
      });

      return res.json(table);
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const inventories = await Inventory.find({ sellerId: seller._id }).populate('seedId');
    const table = inventories.map(inv => ({
      _id: inv._id,
      seedCode: inv.seedId ? inv.seedId.seedCode : 'N/A',
      seedName: inv.seedId ? inv.seedId.seedName : 'Unknown',
      crop: inv.seedId ? inv.seedId.crop : 'N/A',
      category: inv.seedId ? inv.seedId.category : 'N/A',
      openingStock: inv.openingStock,
      purchased: inv.purchased,
      sold: inv.sold,
      damaged: inv.damaged,
      shortage: inv.shortage,
      adjustmentsIn: inv.adjustmentsIn,
      adjustmentsOut: inv.adjustmentsOut,
      currentStock: inv.currentStock,
      minStockLevel: inv.seedId ? inv.seedId.minStockLevel : 20,
      unit: inv.unit,
      stockValue: inv.stockValue,
      status: inv.status,
      lastUpdated: inv.lastUpdated
    }));

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Stock Transaction Audit History
exports.getTransactionHistory = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const txns = store.transactions
        .filter(t => t.sellerId.toString() === seller._id.toString())
        .map(t => {
          const seed = store.seeds.find(s => s._id.toString() === t.seedId.toString()) || {};
          return {
            ...t,
            seedName: seed.seedName || 'N/A',
            crop: seed.crop || 'N/A'
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json(txns);
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const txns = await StockTransaction.find({ sellerId: seller._id })
      .populate('seedId', 'seedName crop seedCode')
      .sort({ date: -1 });

    res.json(txns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
