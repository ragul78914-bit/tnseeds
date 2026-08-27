const Seed = require('../models/Seed');
const Inventory = require('../models/Inventory');
const Seller = require('../models/Seller');
const Farmer = require('../models/Farmer');
const Crop = require('../models/Crop');
const Category = require('../models/Category');
const { calculateDistance } = require('../utils/distance');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

// Main farmer seed search endpoint
exports.searchSeeds = async (req, res) => {
  try {
    const {
      keyword = '',
      crop = '',
      variety = '',
      hybrid = '',
      brand = '',
      district = '',
      availability = '',
      maxDistance = 100, // km
      farmerLat = 11.0168, // Default Coimbatore
      farmerLng = 76.9558,
      minPrice = 0,
      maxPrice = 10000,
      sortBy = 'distance' // 'distance', 'price_asc', 'price_desc', 'availability'
    } = req.query;

    const lat = parseFloat(farmerLat);
    const lng = parseFloat(farmerLng);

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      
      // Active sellers only
      const activeSellerIds = store.sellers
        .filter(s => s.status === 'ACTIVE')
        .map(s => s._id.toString());

      let results = store.seeds
        .filter(seed => seed.status === 'ACTIVE' && activeSellerIds.includes(seed.sellerId.toString()))
        .map(seed => {
          const seller = store.sellers.find(s => s._id.toString() === seed.sellerId.toString());
          const inventory = store.inventories.find(i => i.seedId.toString() === seed._id.toString()) || {
            currentStock: 0,
            status: 'OUT_OF_STOCK',
            lastUpdated: seed.createdAt
          };

          const distanceKm = seller ? calculateDistance(lat, lng, seller.latitude, seller.longitude) : 999;

          // Determine availability status
          let stockStatus = 'OUT_OF_STOCK';
          if (inventory.currentStock > seed.minStockLevel) {
            stockStatus = 'AVAILABLE';
          } else if (inventory.currentStock > 0 && inventory.currentStock <= seed.minStockLevel) {
            stockStatus = 'LOW_STOCK';
          }

          return {
            _id: seed._id,
            seedCode: seed.seedCode,
            seedName: seed.seedName,
            crop: seed.crop,
            category: seed.category,
            variety: seed.variety,
            hybridName: seed.hybridName,
            brand: seed.brand,
            packSize: seed.packSize,
            unit: seed.unit,
            purchasePrice: seed.purchasePrice,
            sellingPrice: seed.sellingPrice,
            description: seed.description,
            suitableSeason: seed.suitableSeason,
            recommendedRegion: seed.recommendedRegion,
            imageUrl: seed.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
            availableQuantity: inventory.currentStock,
            minStockLevel: seed.minStockLevel,
            stockStatus,
            lastUpdated: inventory.lastUpdated || seed.updatedAt,
            seller: seller ? {
              _id: seller._id,
              businessName: seller.businessName,
              ownerName: seller.ownerName,
              phone: seller.phone,
              address: seller.address,
              district: seller.district,
              taluk: seller.taluk,
              latitude: seller.latitude,
              longitude: seller.longitude,
              openingHours: seller.openingHours,
              licenseNo: seller.licenseNo
            } : null,
            distanceKm
          };
        });

      // Filters
      if (keyword) {
        const kw = keyword.toLowerCase().trim();
        results = results.filter(r => 
          r.seedName.toLowerCase().includes(kw) ||
          r.crop.toLowerCase().includes(kw) ||
          r.variety.toLowerCase().includes(kw) ||
          r.hybridName.toLowerCase().includes(kw) ||
          r.brand.toLowerCase().includes(kw) ||
          (r.seller && r.seller.businessName.toLowerCase().includes(kw))
        );
      }

      if (crop) {
        results = results.filter(r => r.crop.toLowerCase() === crop.toLowerCase());
      }

      if (variety) {
        results = results.filter(r => r.variety.toLowerCase().includes(variety.toLowerCase()));
      }

      if (hybrid) {
        results = results.filter(r => r.hybridName.toLowerCase().includes(hybrid.toLowerCase()));
      }

      if (brand) {
        results = results.filter(r => r.brand.toLowerCase().includes(brand.toLowerCase()));
      }

      if (district) {
        results = results.filter(r => r.seller && r.seller.district.toLowerCase() === district.toLowerCase());
      }

      if (availability) {
        results = results.filter(r => r.stockStatus.toLowerCase() === availability.toLowerCase());
      }

      if (maxDistance) {
        results = results.filter(r => r.distanceKm <= parseFloat(maxDistance));
      }

      if (minPrice || maxPrice) {
        results = results.filter(r => r.sellingPrice >= parseFloat(minPrice) && r.sellingPrice <= parseFloat(maxPrice));
      }

      // Sorting
      if (sortBy === 'distance') {
        results.sort((a, b) => a.distanceKm - b.distanceKm);
      } else if (sortBy === 'price_asc') {
        results.sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (sortBy === 'price_desc') {
        results.sort((a, b) => b.sellingPrice - a.sellingPrice);
      } else if (sortBy === 'availability') {
        const order = { 'AVAILABLE': 1, 'LOW_STOCK': 2, 'OUT_OF_STOCK': 3 };
        results.sort((a, b) => (order[a.stockStatus] || 3) - (order[b.stockStatus] || 3));
      }

      return res.json({
        total: results.length,
        farmerLocation: { lat, lng },
        results
      });
    }

    // Mongoose MongoDB Query Engine
    const activeSellers = await Seller.find({ status: 'ACTIVE' }).select('_id');
    const activeSellerIds = activeSellers.map(s => s._id);

    const query = {
      status: 'ACTIVE',
      sellerId: { $in: activeSellerIds }
    };

    if (keyword) {
      query.$or = [
        { seedName: { $regex: keyword, $options: 'i' } },
        { crop: { $regex: keyword, $options: 'i' } },
        { variety: { $regex: keyword, $options: 'i' } },
        { hybridName: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (crop) query.crop = { $regex: crop, $options: 'i' };
    if (variety) query.variety = { $regex: variety, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      query.sellingPrice = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const seeds = await Seed.find(query).populate('sellerId');
    const seedIds = seeds.map(s => s._id);
    const inventories = await Inventory.find({ seedId: { $in: seedIds } });
    const invMap = new Map();
    inventories.forEach(i => invMap.set(i.seedId.toString(), i));

    let results = seeds.map(seed => {
      const seller = seed.sellerId;
      const inv = invMap.get(seed._id.toString()) || { currentStock: 0, status: 'OUT_OF_STOCK', lastUpdated: seed.createdAt };
      const distanceKm = seller ? calculateDistance(lat, lng, seller.latitude, seller.longitude) : 999;

      let stockStatus = 'OUT_OF_STOCK';
      if (inv.currentStock > seed.minStockLevel) {
        stockStatus = 'AVAILABLE';
      } else if (inv.currentStock > 0 && inv.currentStock <= seed.minStockLevel) {
        stockStatus = 'LOW_STOCK';
      }

      return {
        _id: seed._id,
        seedCode: seed.seedCode,
        seedName: seed.seedName,
        crop: seed.crop,
        category: seed.category,
        variety: seed.variety,
        hybridName: seed.hybridName,
        brand: seed.brand,
        packSize: seed.packSize,
        unit: seed.unit,
        purchasePrice: seed.purchasePrice,
        sellingPrice: seed.sellingPrice,
        description: seed.description,
        suitableSeason: seed.suitableSeason,
        recommendedRegion: seed.recommendedRegion,
        imageUrl: seed.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        availableQuantity: inv.currentStock,
        minStockLevel: seed.minStockLevel,
        stockStatus,
        lastUpdated: inv.lastUpdated || seed.updatedAt,
        seller: seller ? {
          _id: seller._id,
          businessName: seller.businessName,
          ownerName: seller.ownerName,
          phone: seller.phone,
          address: seller.address,
          district: seller.district,
          taluk: seller.taluk,
          latitude: seller.latitude,
          longitude: seller.longitude,
          openingHours: seller.openingHours,
          licenseNo: seller.licenseNo
        } : null,
        distanceKm
      };
    });

    if (district) {
      results = results.filter(r => r.seller && r.seller.district.toLowerCase() === district.toLowerCase());
    }

    if (availability) {
      results = results.filter(r => r.stockStatus.toLowerCase() === availability.toLowerCase());
    }

    if (maxDistance) {
      results = results.filter(r => r.distanceKm <= parseFloat(maxDistance));
    }

    // Sorting
    if (sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'price_asc') {
      results.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'availability') {
      const order = { 'AVAILABLE': 1, 'LOW_STOCK': 2, 'OUT_OF_STOCK': 3 };
      results.sort((a, b) => (order[a.stockStatus] || 3) - (order[b.stockStatus] || 3));
    }

    res.json({
      total: results.length,
      farmerLocation: { lat, lng },
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single seed details by ID
exports.getSeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const { farmerLat = 11.0168, farmerLng = 76.9558 } = req.query;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const seed = store.seeds.find(s => s._id.toString() === id.toString());
      if (!seed) return res.status(404).json({ message: 'Seed not found' });

      const seller = store.sellers.find(s => s._id.toString() === seed.sellerId.toString());
      const inventory = store.inventories.find(i => i.seedId.toString() === seed._id.toString()) || {
        currentStock: 0,
        status: 'OUT_OF_STOCK',
        lastUpdated: seed.createdAt
      };

      const distanceKm = seller ? calculateDistance(parseFloat(farmerLat), parseFloat(farmerLng), seller.latitude, seller.longitude) : 999;

      let stockStatus = 'OUT_OF_STOCK';
      if (inventory.currentStock > seed.minStockLevel) {
        stockStatus = 'AVAILABLE';
      } else if (inventory.currentStock > 0 && inventory.currentStock <= seed.minStockLevel) {
        stockStatus = 'LOW_STOCK';
      }

      // Other seeds from nearby sellers or same crop
      const nearbySellers = store.sellers
        .filter(s => s._id.toString() !== seller._id.toString() && s.status === 'ACTIVE')
        .map(s => ({
          ...s,
          distanceKm: calculateDistance(parseFloat(farmerLat), parseFloat(farmerLng), s.latitude, s.longitude)
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5);

      return res.json({
        ...seed,
        imageUrl: seed.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        availableQuantity: inventory.currentStock,
        stockStatus,
        inventory,
        seller,
        distanceKm,
        nearbySellers
      });
    }

    const seed = await Seed.findById(id).populate('sellerId');
    if (!seed) return res.status(404).json({ message: 'Seed not found' });

    const inventory = await Inventory.findOne({ seedId: seed._id }) || { currentStock: 0, status: 'OUT_OF_STOCK', lastUpdated: seed.createdAt };
    const distanceKm = seed.sellerId ? calculateDistance(parseFloat(farmerLat), parseFloat(farmerLng), seed.sellerId.latitude, seed.sellerId.longitude) : 999;

    let stockStatus = 'OUT_OF_STOCK';
    if (inventory.currentStock > seed.minStockLevel) {
      stockStatus = 'AVAILABLE';
    } else if (inventory.currentStock > 0 && inventory.currentStock <= seed.minStockLevel) {
      stockStatus = 'LOW_STOCK';
    }

    res.json({
      ...seed._doc,
      imageUrl: seed.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      availableQuantity: inventory.currentStock,
      stockStatus,
      inventory,
      seller: seed.sellerId,
      distanceKm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of crops and categories for filter dropdowns
exports.getCropsAndCategories = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const store = getMemoryStore();
      return res.json({
        crops: store.crops,
        categories: store.categories,
        districts: ['Coimbatore', 'Erode', 'Salem', 'Madurai', 'Thanjavur', 'Tiruppur', 'Dharmapuri', 'Trichy']
      });
    }

    const crops = await Crop.find({});
    const categories = await Category.find({});
    res.json({
      crops,
      categories,
      districts: ['Coimbatore', 'Erode', 'Salem', 'Madurai', 'Thanjavur', 'Tiruppur', 'Dharmapuri', 'Trichy']
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nearby Seed Centers Page map data
exports.getNearbyCenters = async (req, res) => {
  try {
    const { farmerLat = 11.0168, farmerLng = 76.9558, maxDistance = 50 } = req.query;
    const lat = parseFloat(farmerLat);
    const lng = parseFloat(farmerLng);

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const centers = store.sellers
        .filter(s => s.status === 'ACTIVE')
        .map(seller => {
          const sellerSeeds = store.seeds.filter(seed => seed.sellerId.toString() === seller._id.toString() && seed.status === 'ACTIVE');
          const availableSeeds = sellerSeeds.map(seed => {
            const inv = store.inventories.find(i => i.seedId.toString() === seed._id.toString()) || { currentStock: 0 };
            let status = 'OUT_OF_STOCK';
            if (inv.currentStock > seed.minStockLevel) status = 'AVAILABLE';
            else if (inv.currentStock > 0) status = 'LOW_STOCK';
            return {
              _id: seed._id,
              seedName: seed.seedName,
              crop: seed.crop,
              hybridName: seed.hybridName,
              currentStock: inv.currentStock,
              unit: seed.unit,
              status
            };
          });

          const distanceKm = calculateDistance(lat, lng, seller.latitude, seller.longitude);

          return {
            ...seller,
            distanceKm,
            seedsCount: sellerSeeds.length,
            availableSeeds
          };
        })
        .filter(c => c.distanceKm <= parseFloat(maxDistance))
        .sort((a, b) => a.distanceKm - b.distanceKm);

      return res.json({ farmerLocation: { lat, lng }, centers });
    }

    const sellers = await Seller.find({ status: 'ACTIVE' });
    const centers = [];

    for (const seller of sellers) {
      const sellerSeeds = await Seed.find({ sellerId: seller._id, status: 'ACTIVE' });
      const availableSeeds = [];

      for (const seed of sellerSeeds) {
        const inv = await Inventory.findOne({ seedId: seed._id }) || { currentStock: 0 };
        let status = 'OUT_OF_STOCK';
        if (inv.currentStock > seed.minStockLevel) status = 'AVAILABLE';
        else if (inv.currentStock > 0) status = 'LOW_STOCK';

        availableSeeds.push({
          _id: seed._id,
          seedName: seed.seedName,
          crop: seed.crop,
          hybridName: seed.hybridName,
          currentStock: inv.currentStock,
          unit: seed.unit,
          status
        });
      }

      const distanceKm = calculateDistance(lat, lng, seller.latitude, seller.longitude);
      if (distanceKm <= parseFloat(maxDistance)) {
        centers.push({
          ...seller._doc,
          distanceKm,
          seedsCount: sellerSeeds.length,
          availableSeeds
        });
      }
    }

    centers.sort((a, b) => a.distanceKm - b.distanceKm);
    res.json({ farmerLocation: { lat, lng }, centers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
