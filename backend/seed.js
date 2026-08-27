const bcrypt = require('bcryptjs');

const runSeeder = async () => {
  const { connectDB, getMemoryStore, isInMemoryMode } = require('./config/db');
  await connectDB();

  console.log('[Seeder] Populating Smart Seed Management System with realistic Indian Agriculture data...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  const sellerPasswordHash = await bcrypt.hash('seller123', 10);
  const farmerPasswordHash = await bcrypt.hash('farmer123', 10);

  // 1. Users
  const users = [
    { _id: 'u_admin', name: 'NIXTION Admin', email: 'admin@example.com', password: passwordHash, role: 'ADMIN', phone: '9000000001', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_seller1', name: 'Sri Lakshmi Seeds', email: 'seller@example.com', password: sellerPasswordHash, role: 'SELLER', phone: '9842212345', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_seller2', name: 'Green Farm Agri Center', email: 'erode_seeds@example.com', password: sellerPasswordHash, role: 'SELLER', phone: '9842223456', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_seller3', name: 'Tamil Agro Depot', email: 'salem_agro@example.com', password: sellerPasswordHash, role: 'SELLER', phone: '9842234567', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_seller4', name: 'Madurai Hybrid Seed Center', email: 'madurai_seeds@example.com', password: sellerPasswordHash, role: 'SELLER', phone: '9842245678', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_seller5', name: 'Delta Kaveri Agro Store', email: 'delta_seeds@example.com', password: sellerPasswordHash, role: 'SELLER', phone: '9842256789', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_farmer1', name: 'Ramasamy K', email: 'farmer@example.com', password: farmerPasswordHash, role: 'FARMER', phone: '9789012345', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_farmer2', name: 'Murugan V', email: 'farmer2@example.com', password: farmerPasswordHash, role: 'FARMER', phone: '9789023456', status: 'ACTIVE', createdAt: new Date() },
    { _id: 'u_farmer3', name: 'Selvam S', email: 'farmer3@example.com', password: farmerPasswordHash, role: 'FARMER', phone: '9789034567', status: 'ACTIVE', createdAt: new Date() }
  ];

  // 2. Sellers
  const sellers = [
    {
      _id: 's_1',
      userId: 'u_seller1',
      businessName: 'Sri Lakshmi Seeds & Fertilisers',
      ownerName: 'Sri Lakshmi Seeds',
      phone: '9842212345',
      email: 'seller@example.com',
      address: '124 Agro Market Road, R.S. Puram, Coimbatore',
      district: 'Coimbatore',
      taluk: 'Coimbatore South',
      village: 'R.S. Puram',
      pincode: '641002',
      latitude: 11.0014,
      longitude: 76.9516,
      licenseNo: 'LIC-CBE-2024-8891',
      gstNo: '33AABCS1234F1Z1',
      openingHours: '7:30 AM - 8:30 PM',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 's_2',
      userId: 'u_seller2',
      businessName: 'Green Farm Agri Center',
      ownerName: 'Karthik N',
      phone: '9842223456',
      email: 'erode_seeds@example.com',
      address: '45 Brough Road, Erode',
      district: 'Erode',
      taluk: 'Erode Town',
      village: 'Perundurai Road',
      pincode: '638001',
      latitude: 11.3410,
      longitude: 77.7172,
      licenseNo: 'LIC-ERD-2023-4412',
      gstNo: '33AABCG5678F1Z2',
      openingHours: '8:00 AM - 8:00 PM',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 's_3',
      userId: 'u_seller3',
      businessName: 'Tamil Agro Depot',
      ownerName: 'Prakash M',
      phone: '9842234567',
      email: 'salem_agro@example.com',
      address: '89 New Bus Stand Road, Salem',
      district: 'Salem',
      taluk: 'Salem South',
      village: 'Meyyanur',
      pincode: '636004',
      latitude: 11.6643,
      longitude: 78.1460,
      licenseNo: 'LIC-SLM-2024-9920',
      gstNo: '33AABCT9988F1Z3',
      openingHours: '8:00 AM - 9:00 PM',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 's_4',
      userId: 'u_seller4',
      businessName: 'Madurai Hybrid Seed Center',
      ownerName: 'Venkatesh R',
      phone: '9842245678',
      email: 'madurai_seeds@example.com',
      address: '12 Simmakkal Main Road, Madurai',
      district: 'Madurai',
      taluk: 'Madurai North',
      village: 'Simmakkal',
      pincode: '625001',
      latitude: 9.9252,
      longitude: 78.1198,
      licenseNo: 'LIC-MDU-2023-1123',
      gstNo: '33AABCM1122F1Z4',
      openingHours: '7:30 AM - 8:00 PM',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 's_5',
      userId: 'u_seller5',
      businessName: 'Delta Kaveri Agro Store',
      ownerName: 'Sundaram P',
      phone: '9842256789',
      email: 'delta_seeds@example.com',
      address: '77 Old Bus Stand, Thanjavur',
      district: 'Thanjavur',
      taluk: 'Thanjavur',
      village: 'South Rampart',
      pincode: '613001',
      latitude: 10.7870,
      longitude: 79.1378,
      licenseNo: 'LIC-TNJ-2024-3312',
      gstNo: '33AABCD3344F1Z5',
      openingHours: '8:00 AM - 8:00 PM',
      status: 'ACTIVE',
      createdAt: new Date()
    }
  ];

  // 3. Farmers
  const farmers = [
    { _id: 'f_1', userId: 'u_farmer1', name: 'Ramasamy K', phone: '9789012345', district: 'Coimbatore', taluk: 'Perur', latitude: 10.9700, longitude: 76.9200, createdAt: new Date() },
    { _id: 'f_2', userId: 'u_farmer2', name: 'Murugan V', phone: '9789023456', district: 'Erode', taluk: 'Perundurai', latitude: 11.2700, longitude: 77.5800, createdAt: new Date() },
    { _id: 'f_3', userId: 'u_farmer3', name: 'Selvam S', phone: '9789034567', district: 'Salem', taluk: 'Attur', latitude: 11.5900, longitude: 78.6000, createdAt: new Date() }
  ];

  // 4. Crops & Categories
  const crops = [
    { _id: 'c_1', name: 'Paddy', code: 'PADDY', description: 'High yield rice seeds', icon: '🌾' },
    { _id: 'c_2', name: 'Maize', code: 'MAIZE', description: 'Corn / Maize hybrids', icon: '🌽' },
    { _id: 'c_3', name: 'Cotton', code: 'COTTON', description: 'Bt Cotton & hybrid varieties', icon: '☁️' },
    { _id: 'c_4', name: 'Groundnut', code: 'GNDNUT', description: 'High oil groundnut seeds', icon: '🥜' },
    { _id: 'c_5', name: 'Tomato', code: 'TOMATO', description: 'Hybrid vegetable tomato seeds', icon: '🍅' },
    { _id: 'c_6', name: 'Chilli', code: 'CHILLI', description: 'Pungent hybrid chilli seeds', icon: '🌶️' },
    { _id: 'c_7', name: 'Onion', code: 'ONION', description: 'High keeping quality onion seeds', icon: '🧅' }
  ];

  const categories = [
    { _id: 'cat_1', name: 'Hybrid Seed', description: 'F1 Hybrid Seeds' },
    { _id: 'cat_2', name: 'Certified Seed', description: 'Government certified pure seed' },
    { _id: 'cat_3', name: 'High Yield Variety (HYV)', description: 'Enhanced productivity seeds' }
  ];

  // 5. Seeds List (30 Products across Sellers)
  const seedTemplates = [
    { code: 'SEED-000001', name: 'Maize Hybrid 520', crop: 'Maize', variety: 'F1 Super Gold', hybridName: 'MH-520', brand: 'Syngenta', price: 420, pPrice: 340, pack: '1 kg', min: 30, suitable: 'Kharif & Rabi', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000002', name: 'Paddy CR 1009 Sub 1', crop: 'Paddy', variety: 'Flood Tolerant Hybrid', hybridName: 'CR-1009', brand: 'TNAU Seeds', price: 65, pPrice: 50, pack: '10 kg', min: 100, suitable: 'Samba / Thaladi', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000003', name: 'Paddy CO 51 Hybrid', crop: 'Paddy', variety: 'Short Duration 110 Days', hybridName: 'CO-51', brand: 'TNAU Certified', price: 70, pPrice: 55, pack: '10 kg', min: 150, suitable: 'Kuruvai / Navarai', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000004', name: 'Bt Cotton Rasi 659', crop: 'Cotton', variety: 'Bollgard II Hybrid', hybridName: 'Rasi-659', brand: 'Rasi Seeds', price: 860, pPrice: 720, pack: '475 g', min: 25, suitable: 'Kharif Irrigated', img: 'https://images.unsplash.com/photo-1595009503377-e3be116106b6?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000005', name: 'Groundnut Kadiri 6', crop: 'Groundnut', variety: 'Bold Seed High Oil', hybridName: 'K-6', brand: 'National Seeds', price: 140, pPrice: 110, pack: '5 kg', min: 50, suitable: 'Rainfed & Irrigated', img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000006', name: 'Tomato Abhinav Hybrid', crop: 'Tomato', variety: 'TLCV Resistant', hybridName: 'Abhinav F1', brand: 'Seminis', price: 950, pPrice: 780, pack: '10 g', min: 10, suitable: 'All Season', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000007', name: 'Chilli Syngenta 5531', crop: 'Chilli', variety: 'High Pungency Dark Red', hybridName: 'SYN-5531', brand: 'Syngenta', price: 1450, pPrice: 1200, pack: '10 g', min: 10, suitable: 'Kharif & Rabi', img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80' },
    { code: 'SEED-000008', name: 'Onion Bhima Super', crop: 'Onion', variety: 'Red Globe Bulb', hybridName: 'Bhima Super', brand: 'DOGR Certified', price: 1250, pPrice: 980, pack: '500 g', min: 15, suitable: 'Late Kharif / Rabi', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' }
  ];

  const seeds = [];
  const inventories = [];
  const transactions = [];

  let seedIdCount = 1;
  sellers.forEach((seller, sIdx) => {
    seedTemplates.forEach((template, tIdx) => {
      const seedId = `seed_${seedIdCount}`;
      const seedCode = `SEED-${seedIdCount.toString().padStart(6, '0')}`;
      
      const seed = {
        _id: seedId,
        seedCode,
        seedName: `${template.name}`,
        crop: template.crop,
        category: 'Hybrid Seed',
        variety: template.variety,
        hybridName: template.hybridName,
        brand: template.brand,
        hsnCode: '12099990',
        unit: 'kg',
        packSize: template.pack,
        purchasePrice: template.pPrice,
        sellingPrice: template.price,
        gstPercent: 0,
        openingQuantity: 300 - (tIdx * 20),
        minStockLevel: template.min,
        maxStockLevel: 1000,
        supplier: 'National Seed Corporation',
        description: `Premium quality ${template.crop} hybrid seed tested for 98%+ germination rate. Suitable for ${template.suitable}.`,
        suitableSeason: template.suitable,
        recommendedRegion: 'Tamil Nadu',
        imageUrl: template.img,
        status: 'ACTIVE',
        sellerId: seller._id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      seeds.push(seed);

      // Vary stock quantities across sellers for realistic search demo
      let currentStock = 250 - (sIdx * 45) - (tIdx * 15);
      if (currentStock < 0) currentStock = 0;

      let status = 'OUT_OF_STOCK';
      if (currentStock > seed.minStockLevel) status = 'AVAILABLE';
      else if (currentStock > 0) status = 'LOW_STOCK';

      const invId = `inv_${seedIdCount}`;
      const inventory = {
        _id: invId,
        seedId,
        sellerId: seller._id,
        openingStock: 300,
        purchased: 100,
        sold: 300 - currentStock > 0 ? 300 - currentStock : 0,
        damaged: 5,
        shortage: 0,
        adjustmentsIn: 0,
        adjustmentsOut: 0,
        currentStock,
        unit: 'kg',
        stockValue: currentStock * seed.purchasePrice,
        status,
        lastUpdated: new Date()
      };
      inventories.push(inventory);

      // Add Stock Transaction audit record
      transactions.push({
        _id: `txn_${seedIdCount}`,
        transactionNo: `TXN-20260827-${seedIdCount.toString().padStart(4, '0')}`,
        date: new Date(Date.now() - (seedIdCount * 3600000)),
        seedId,
        sellerId: seller._id,
        type: 'PURCHASE',
        quantity: 300,
        unit: 'kg',
        price: seed.purchasePrice,
        oldStock: 0,
        newStock: 300,
        batchNumber: `BATCH-TN-${202600 + seedIdCount}`,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        invoiceNo: `INV-2024-${1000 + seedIdCount}`,
        supplier: 'National Seed Corporation',
        notes: 'Initial opening stock entry',
        createdBy: seller.userId,
        createdAt: new Date()
      });

      seedIdCount++;
    });
  });

  // 6. Government Schemes
  const schemes = [
    {
      _id: 'scheme_1',
      schemeName: 'Sub-Mission on Seeds and Planting Material (SMSP)',
      department: 'Department of Agriculture & Farmers Welfare, Govt of India / TN',
      description: 'Provides 50% subsidy on certified hybrid paddy, maize, and pulse seeds for small and marginal farmers.',
      eligibility: 'All registered farmers holding agricultural land in Tamil Nadu.',
      benefits: '50% seed cost subsidy directly credited to bank account or provided at seed distribution centers.',
      requiredDocuments: 'Aadhaar Card, Land Record (Patta/Chitta), Bank Account Passbook Copy',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      officialLink: 'https://tnagrisnet.tn.gov.in/SMSP',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 'scheme_2',
      schemeName: 'Kalaignarin All Village Cereal & Seed Mission',
      department: 'Tamil Nadu Agriculture Department',
      description: 'Free mini-kits of high-yielding vegetable and millet hybrid seeds for smallholder farmers across 12,525 panchayats.',
      eligibility: 'Small/marginal farmers, women farmers, and SC/ST farmers in TN.',
      benefits: '100% free distribution of seed kits containing tomato, chilli, brinjal, and maize seeds.',
      requiredDocuments: 'Aadhaar Card, Chitta Extract, Ration Card',
      startDate: new Date('2026-05-15'),
      endDate: new Date('2026-12-31'),
      officialLink: 'https://tnagrisnet.tn.gov.in/KalaignarAgri',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      _id: 'scheme_3',
      schemeName: 'National Food Security Mission (NFSM) - Pulses & Oilseeds',
      department: 'Ministry of Agriculture and Farmers Welfare',
      description: 'Financial assistance of ₹40/kg for certified groundnut and pulse seeds to encourage crop diversification.',
      eligibility: 'Farmers practicing rainfed groundnut and pulse cultivation.',
      benefits: 'Direct financial subsidy of ₹40 per kg on certified seed purchases.',
      requiredDocuments: 'Aadhaar Card, Patta Copy, Bank Account Details',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2027-02-28'),
      officialLink: 'https://nfsm.gov.in',
      status: 'ACTIVE',
      createdAt: new Date()
    }
  ];

  // 7. Audit Logs
  const auditLogs = [
    { _id: 'audit_1', userId: 'u_admin', userName: 'NIXTION Admin', role: 'ADMIN', action: 'SYSTEM_INITIALIZED', module: 'SYSTEM', recordId: 'NIXTION-v1', newValue: 'Seed Availability System initialized with 5 sellers and 40 products', timestamp: new Date() }
  ];

  // Populate into Mongoose or Memory Store
  if (isInMemoryMode()) {
    const store = getMemoryStore();
    store.users = users;
    store.sellers = sellers;
    store.farmers = farmers;
    store.crops = crops;
    store.categories = categories;
    store.seeds = seeds;
    store.inventories = inventories;
    store.transactions = transactions;
    store.schemes = schemes;
    store.auditLogs = auditLogs;
    console.log('[Seeder] Memory Store loaded successfully with 5 Sellers, 40 Seed records, and 3 Schemes!');
  } else {
    const User = require('./models/User');
    const Seller = require('./models/Seller');
    const Farmer = require('./models/Farmer');
    const Crop = require('./models/Crop');
    const Category = require('./models/Category');
    const Seed = require('./models/Seed');
    const Inventory = require('./models/Inventory');
    const StockTransaction = require('./models/StockTransaction');
    const GovernmentScheme = require('./models/GovernmentScheme');
    const AuditLog = require('./models/AuditLog');

    await User.deleteMany({});
    await Seller.deleteMany({});
    await Farmer.deleteMany({});
    await Crop.deleteMany({});
    await Category.deleteMany({});
    await Seed.deleteMany({});
    await Inventory.deleteMany({});
    await StockTransaction.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await AuditLog.deleteMany({});

    await User.insertMany(users);
    await Seller.insertMany(sellers);
    await Farmer.insertMany(farmers);
    await Crop.insertMany(crops);
    await Category.insertMany(categories);
    await Seed.insertMany(seeds);
    await Inventory.insertMany(inventories);
    await StockTransaction.insertMany(transactions);
    await GovernmentScheme.insertMany(schemes);
    await AuditLog.insertMany(auditLogs);

    console.log('[Seeder] MongoDB Collections populated successfully!');
  }
};

module.exports = runSeeder;

if (require.main === module) {
  runSeeder().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
