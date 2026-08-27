const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const Seller = require('../models/Seller');
const AuditLog = require('../models/AuditLog');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

// Helper to generate seed code (SEED-XXXXXX)
const generateSeedCode = (count) => {
  const num = (count + 1).toString().padStart(6, '0');
  return `SEED-${num}`;
};

exports.getSellerSeeds = async (req, res) => {
  try {
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const seeds = store.seeds.filter(s => s.sellerId.toString() === seller._id.toString());
      const results = seeds.map(seed => {
        const inv = store.inventories.find(i => i.seedId.toString() === seed._id.toString()) || { currentStock: 0, status: 'OUT_OF_STOCK' };
        return {
          ...seed,
          inventory: inv
        };
      });

      return res.json(results);
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const seeds = await Seed.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    const seedIds = seeds.map(s => s._id);
    const inventories = await Inventory.find({ seedId: { $in: seedIds } });
    const invMap = new Map();
    inventories.forEach(i => invMap.set(i.seedId.toString(), i));

    const results = seeds.map(seed => ({
      ...seed._doc,
      inventory: invMap.get(seed._id.toString()) || { currentStock: 0, status: 'OUT_OF_STOCK' }
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSeed = async (req, res) => {
  try {
    const user = req.user;
    const {
      seedName, crop, category, variety, hybridName, brand, hsnCode, unit, packSize,
      purchasePrice, sellingPrice, gstPercent, openingQuantity, minStockLevel, maxStockLevel,
      supplier, description, suitableSeason, recommendedRegion, imageUrl
    } = req.body;

    if (!seedName || !crop || !variety || !brand || !purchasePrice || !sellingPrice) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seller = store.sellers.find(s => s.userId === user._id);
      if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

      const count = store.seeds.length;
      const seedCode = generateSeedCode(count);
      const seedId = 'seed_' + Date.now();

      const newSeed = {
        _id: seedId,
        seedCode,
        seedName,
        crop,
        category: category || 'Hybrid Seed',
        variety,
        hybridName: hybridName || '',
        brand,
        hsnCode: hsnCode || '12099990',
        unit: unit || 'kg',
        packSize: packSize || '1 kg',
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        gstPercent: parseFloat(gstPercent || 0),
        openingQuantity: parseFloat(openingQuantity || 0),
        minStockLevel: parseFloat(minStockLevel || 20),
        maxStockLevel: parseFloat(maxStockLevel || 1000),
        supplier: supplier || '',
        description: description || '',
        suitableSeason: suitableSeason || 'Kharif & Rabi',
        recommendedRegion: recommendedRegion || 'Tamil Nadu',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        sellerId: seller._id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.seeds.push(newSeed);

      // Create Initial Inventory Record
      const openingStock = parseFloat(openingQuantity || 0);
      let status = 'OUT_OF_STOCK';
      if (openingStock > newSeed.minStockLevel) status = 'AVAILABLE';
      else if (openingStock > 0) status = 'LOW_STOCK';

      const inventory = {
        _id: 'inv_' + Date.now(),
        seedId,
        sellerId: seller._id,
        openingStock,
        purchased: 0,
        sold: 0,
        damaged: 0,
        shortage: 0,
        adjustmentsIn: 0,
        adjustmentsOut: 0,
        currentStock: openingStock,
        unit: newSeed.unit,
        stockValue: openingStock * newSeed.purchasePrice,
        status,
        lastUpdated: new Date()
      };
      store.inventories.push(inventory);

      // Audit log
      store.auditLogs.push({
        _id: 'audit_' + Date.now(),
        userId: user._id,
        userName: user.name,
        role: user.role,
        action: 'CREATED_SEED',
        module: 'SEED_MANAGEMENT',
        recordId: seedCode,
        newValue: `${seedName} (${crop}) created with opening stock ${openingStock} ${newSeed.unit}`,
        timestamp: new Date()
      });

      return res.status(201).json({ seed: newSeed, inventory });
    }

    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const count = await Seed.countDocuments();
    const seedCode = generateSeedCode(count);

    const seed = await Seed.create({
      seedCode,
      seedName,
      crop,
      category: category || 'Hybrid Seed',
      variety,
      hybridName: hybridName || '',
      brand,
      hsnCode: hsnCode || '12099990',
      unit: unit || 'kg',
      packSize: packSize || '1 kg',
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
      gstPercent: parseFloat(gstPercent || 0),
      openingQuantity: parseFloat(openingQuantity || 0),
      minStockLevel: parseFloat(minStockLevel || 20),
      maxStockLevel: parseFloat(maxStockLevel || 1000),
      supplier: supplier || '',
      description: description || '',
      suitableSeason: suitableSeason || 'Kharif & Rabi',
      recommendedRegion: recommendedRegion || 'Tamil Nadu',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      status: 'ACTIVE',
      sellerId: seller._id
    });

    const openingStock = parseFloat(openingQuantity || 0);
    let status = 'OUT_OF_STOCK';
    if (openingStock > seed.minStockLevel) status = 'AVAILABLE';
    else if (openingStock > 0) status = 'LOW_STOCK';

    const inventory = await Inventory.create({
      seedId: seed._id,
      sellerId: seller._id,
      openingStock,
      currentStock: openingStock,
      unit: seed.unit,
      stockValue: openingStock * seed.purchasePrice,
      status,
      lastUpdated: new Date()
    });

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'CREATED_SEED',
      module: 'SEED_MANAGEMENT',
      recordId: seedCode,
      newValue: `${seedName} (${crop}) created with opening stock ${openingStock} ${seed.unit}`
    });

    res.status(201).json({ seed, inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSeed = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const index = store.seeds.findIndex(s => s._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ message: 'Seed not found' });

      store.seeds[index] = {
        ...store.seeds[index],
        ...req.body,
        updatedAt: new Date()
      };

      return res.json(store.seeds[index]);
    }

    const seed = await Seed.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, { new: true });
    res.json(seed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSeedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seed = store.seeds.find(s => s._id.toString() === id.toString());
      if (!seed) return res.status(404).json({ message: 'Seed not found' });

      seed.status = seed.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      seed.updatedAt = new Date();
      return res.json({ message: `Seed is now ${seed.status}`, seed });
    }

    const seed = await Seed.findById(id);
    if (!seed) return res.status(404).json({ message: 'Seed not found' });

    seed.status = seed.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    seed.updatedAt = Date.now();
    await seed.save();

    res.json({ message: `Seed is now ${seed.status}`, seed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
