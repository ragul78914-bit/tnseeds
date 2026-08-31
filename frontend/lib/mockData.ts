// Comprehensive Mock & Fallback Data Layer for TNSEEDS
// Allows instant, offline, and Vercel serverless demo functionality

export interface Seller {
  _id: string;
  userId?: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  village: string;
  pincode: string;
  latitude: number;
  longitude: number;
  licenseNo: string;
  gstNo: string;
  openingHours: string;
  status: 'ACTIVE' | 'INACTIVE';
  distanceKm?: number;
}

export interface SeedProduct {
  _id: string;
  seedCode: string;
  seedName: string;
  crop: string;
  category: string;
  variety: string;
  hybridName: string;
  brand: string;
  hsnCode?: string;
  unit: string;
  packSize: string;
  purchasePrice: number;
  sellingPrice: number;
  gstPercent?: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  supplier: string;
  description: string;
  suitableSeason: string;
  recommendedRegion: string;
  imageUrl: string;
  stockStatus: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  sellerId: string;
  seller?: Seller;
  distanceKm?: number;
  germinationRate?: string;
  purityPercent?: string;
  durationDays?: string;
  sowingSeason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MOCK_SELLERS: Seller[] = [
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
  }
];

export const MOCK_CROPS = [
  { _id: 'c_1', name: 'Paddy', code: 'PADDY', description: 'High yield rice seeds', icon: '🌾' },
  { _id: 'c_2', name: 'Maize', code: 'MAIZE', description: 'Corn / Maize hybrids', icon: '🌽' },
  { _id: 'c_3', name: 'Cotton', code: 'COTTON', description: 'Bt Cotton & hybrid varieties', icon: '☁️' },
  { _id: 'c_4', name: 'Groundnut', code: 'GNDNUT', description: 'High oil groundnut seeds', icon: '🥜' },
  { _id: 'c_5', name: 'Tomato', code: 'TOMATO', description: 'Hybrid vegetable tomato seeds', icon: '🍅' },
  { _id: 'c_6', name: 'Chilli', code: 'CHILLI', description: 'Pungent hybrid chilli seeds', icon: '🌶️' },
  { _id: 'c_7', name: 'Onion', code: 'ONION', description: 'High keeping quality onion seeds', icon: '🧅' }
];

export const MOCK_CATEGORIES = [
  { _id: 'cat_1', name: 'Hybrid Seed', description: 'F1 Hybrid Seeds' },
  { _id: 'cat_2', name: 'Certified Seed', description: 'Government certified pure seed' },
  { _id: 'cat_3', name: 'High Yield Variety (HYV)', description: 'Enhanced productivity seeds' }
];

export const MOCK_DISTRICTS = [
  'Coimbatore',
  'Erode',
  'Salem',
  'Madurai',
  'Thanjavur',
  'Tiruppur',
  'Dharmapuri',
  'Trichy'
];

const SEED_TEMPLATES = [
  {
    name: 'Maize Hybrid 520',
    crop: 'Maize',
    variety: 'F1 Super Gold',
    hybridName: 'MH-520',
    brand: 'Syngenta',
    price: 420,
    pPrice: 340,
    pack: '1 kg',
    min: 30,
    suitable: 'Kharif & Rabi',
    germination: '98%',
    purity: '99%',
    duration: '105 - 110 Days',
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    desc: 'High-yielding yellow corn hybrid with exceptional grain filling, drought tolerance, and uniform orange-yellow flint grains suitable for both fodder and grain.'
  },
  {
    name: 'Paddy CR 1009 Sub 1',
    crop: 'Paddy',
    variety: 'Flood Tolerant Hybrid',
    hybridName: 'CR-1009',
    brand: 'TNAU Seeds',
    price: 65,
    pPrice: 50,
    pack: '10 kg',
    min: 100,
    suitable: 'Samba / Thaladi',
    germination: '95%',
    purity: '98%',
    duration: '150 - 155 Days',
    img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80',
    desc: 'Submergence tolerant long-duration samba paddy variety popular across Tamil Nadu delta zones. Survives up to 14 days of complete water submergence.'
  },
  {
    name: 'Paddy CO 51 Hybrid',
    crop: 'Paddy',
    variety: 'Short Duration 110 Days',
    hybridName: 'CO-51',
    brand: 'TNAU Certified',
    price: 70,
    pPrice: 55,
    pack: '10 kg',
    min: 150,
    suitable: 'Kuruvai / Navarai',
    germination: '96%',
    purity: '99%',
    duration: '105 - 110 Days',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    desc: 'BPH and blast resistant high yield early paddy variety yielding slender white grain with excellent cooking quality.'
  },
  {
    name: 'Bt Cotton Rasi 659',
    crop: 'Cotton',
    variety: 'Bollgard II Hybrid',
    hybridName: 'Rasi-659',
    brand: 'Rasi Seeds',
    price: 860,
    pPrice: 720,
    pack: '475 g',
    min: 25,
    suitable: 'Kharif Irrigated',
    germination: '90%',
    purity: '98%',
    duration: '150 - 165 Days',
    img: 'https://images.unsplash.com/photo-1595009503377-e3be116106b6?auto=format&fit=crop&w=800&q=80',
    desc: 'Premium Bollgard II hybrid cotton seed with big boll size (5.5 - 6.0 g), high ginning outturn (36-37%), and strong resistance against American bollworm.'
  },
  {
    name: 'Groundnut Kadiri 6',
    crop: 'Groundnut',
    variety: 'Bold Seed High Oil',
    hybridName: 'K-6',
    brand: 'National Seeds',
    price: 140,
    pPrice: 110,
    pack: '5 kg',
    min: 50,
    suitable: 'Rainfed & Irrigated',
    germination: '92%',
    purity: '97%',
    duration: '100 - 105 Days',
    img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
    desc: 'Spanish bunch type bold seed with 50.5% oil content, high shelling percentage (75%), and tolerance to leaf spot and rust.'
  },
  {
    name: 'Tomato Abhinav Hybrid',
    crop: 'Tomato',
    variety: 'TLCV Resistant',
    hybridName: 'Abhinav F1',
    brand: 'Seminis',
    price: 950,
    pPrice: 780,
    pack: '10 g',
    min: 10,
    suitable: 'All Season',
    germination: '95%',
    purity: '99%',
    duration: '60 - 65 Days after transplant',
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    desc: 'Indeterminate vigorous plant producing firm, square-round deep red fruits (80-100g) with excellent shelf life for long distance transportation.'
  },
  {
    name: 'Chilli Syngenta 5531',
    crop: 'Chilli',
    variety: 'High Pungency Dark Red',
    hybridName: 'SYN-5531',
    brand: 'Syngenta',
    price: 1450,
    pPrice: 1200,
    pack: '10 g',
    min: 10,
    suitable: 'Kharif & Rabi',
    germination: '94%',
    purity: '99%',
    duration: '70 - 75 Days',
    img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    desc: 'Highly prolific hybrid chilli with uniform shiny dark red fruits (10-12 cm length), high capsaicin content, and tolerance to viral wilt.'
  },
  {
    name: 'Onion Bhima Super',
    crop: 'Onion',
    variety: 'Red Globe Bulb',
    hybridName: 'Bhima Super',
    brand: 'DOGR Certified',
    price: 1250,
    pPrice: 980,
    pack: '500 g',
    min: 15,
    suitable: 'Late Kharif / Rabi',
    germination: '90%',
    purity: '98%',
    duration: '110 - 120 Days',
    img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    desc: 'Attractive single-centered red globe onion with thin neck and high yield (20-22 t/ha). Excellent storability for 3 months.'
  }
];

// Calculate distance in KM between two GPS coordinates (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Generate the 40 seed products across all 5 sellers
export function generateMockSeeds(): SeedProduct[] {
  const seeds: SeedProduct[] = [];
  let count = 1;

  MOCK_SELLERS.forEach((seller, sIdx) => {
    SEED_TEMPLATES.forEach((tpl, tIdx) => {
      const seedId = `seed_${count}`;
      const seedCode = `SEED-${count.toString().padStart(6, '0')}`;

      // Stock variation
      let stock = 280 - (sIdx * 40) - (tIdx * 15);
      if (stock < 0) stock = 0;

      let stockStatus: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'OUT_OF_STOCK';
      if (stock > tpl.min) {
        stockStatus = 'AVAILABLE';
      } else if (stock > 0) {
        stockStatus = 'LOW_STOCK';
      }

      // Base location: Coimbatore (11.0168, 76.9558)
      const distanceKm = calculateDistance(11.0168, 76.9558, seller.latitude, seller.longitude);

      seeds.push({
        _id: seedId,
        seedCode,
        seedName: tpl.name,
        crop: tpl.crop,
        category: 'Hybrid Seed',
        variety: tpl.variety,
        hybridName: tpl.hybridName,
        brand: tpl.brand,
        hsnCode: '12099990',
        unit: 'kg',
        packSize: tpl.pack,
        purchasePrice: tpl.pPrice,
        sellingPrice: tpl.price,
        gstPercent: 0,
        availableQuantity: stock,
        minStockLevel: tpl.min,
        maxStockLevel: 1000,
        supplier: 'National Seed Corporation / TNAU',
        description: tpl.desc,
        suitableSeason: tpl.suitable,
        recommendedRegion: 'Tamil Nadu & Southern States',
        imageUrl: tpl.img,
        stockStatus,
        sellerId: seller._id,
        seller,
        distanceKm,
        germinationRate: tpl.germination,
        purityPercent: tpl.purity,
        durationDays: tpl.duration,
        sowingSeason: tpl.suitable,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      count++;
    });
  });

  return seeds;
}

export const ALL_MOCK_SEEDS: SeedProduct[] = generateMockSeeds();

// Find single seed by any identifier (_id, numeric index, code, or name)
export function getMockSeedById(identifier: string | number, farmerLat = 11.0168, farmerLng = 76.9558): SeedProduct {
  const idStr = String(identifier).trim().toLowerCase();

  // Try exact match by _id
  let found = ALL_MOCK_SEEDS.find(s => s._id.toLowerCase() === idStr);

  // Try match by seedCode
  if (!found) {
    found = ALL_MOCK_SEEDS.find(s => s.seedCode.toLowerCase() === idStr);
  }

  // Try match numeric index (e.g. "1" -> "seed_1")
  if (!found && !isNaN(Number(idStr))) {
    const num = Number(idStr);
    found = ALL_MOCK_SEEDS.find(s => s._id === `seed_${num}`) || ALL_MOCK_SEEDS[num - 1];
  }

  // Try match by prefix or crop/name
  if (!found) {
    found = ALL_MOCK_SEEDS.find(s => s.seedName.toLowerCase().includes(idStr) || s.crop.toLowerCase().includes(idStr));
  }

  // Fallback to first seed if nothing matched
  const result = found ? { ...found } : { ...ALL_MOCK_SEEDS[0] };

  // Calculate dynamic distance from user coords if seller exists
  if (result.seller) {
    result.distanceKm = calculateDistance(farmerLat, farmerLng, result.seller.latitude, result.seller.longitude);
  }

  return result;
}

// Search and filter seeds
export function searchMockSeeds(params: {
  keyword?: string;
  crop?: string;
  variety?: string;
  district?: string;
  availability?: string;
  maxDistance?: number | string;
  farmerLat?: number | string;
  farmerLng?: number | string;
  sortBy?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
}) {
  const lat = parseFloat(String(params.farmerLat || 11.0168));
  const lng = parseFloat(String(params.farmerLng || 76.9558));
  const maxDist = parseFloat(String(params.maxDistance || 150));

  let results = ALL_MOCK_SEEDS.map(seed => {
    const seller = seed.seller;
    const distanceKm = seller ? calculateDistance(lat, lng, seller.latitude, seller.longitude) : 999;
    return {
      ...seed,
      distanceKm
    };
  });

  if (params.keyword) {
    const kw = params.keyword.toLowerCase().trim();
    results = results.filter(r =>
      r.seedName.toLowerCase().includes(kw) ||
      r.crop.toLowerCase().includes(kw) ||
      r.variety.toLowerCase().includes(kw) ||
      r.hybridName.toLowerCase().includes(kw) ||
      r.brand.toLowerCase().includes(kw) ||
      (r.seller && r.seller.businessName.toLowerCase().includes(kw))
    );
  }

  if (params.crop) {
    results = results.filter(r => r.crop.toLowerCase() === params.crop!.toLowerCase());
  }

  if (params.variety) {
    results = results.filter(r => r.variety.toLowerCase().includes(params.variety!.toLowerCase()));
  }

  if (params.district) {
    results = results.filter(r => r.seller && r.seller.district.toLowerCase() === params.district!.toLowerCase());
  }

  if (params.availability) {
    results = results.filter(r => r.stockStatus.toLowerCase() === params.availability!.toLowerCase());
  }

  if (maxDist) {
    results = results.filter(r => r.distanceKm <= maxDist);
  }

  if (params.minPrice) {
    results = results.filter(r => r.sellingPrice >= parseFloat(String(params.minPrice)));
  }
  if (params.maxPrice) {
    results = results.filter(r => r.sellingPrice <= parseFloat(String(params.maxPrice)));
  }

  // Sorting
  const sortBy = params.sortBy || 'distance';
  if (sortBy === 'distance') {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'price_asc') {
    results.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sortBy === 'availability') {
    const order = { AVAILABLE: 1, LOW_STOCK: 2, OUT_OF_STOCK: 3 };
    results.sort((a, b) => (order[a.stockStatus] || 3) - (order[b.stockStatus] || 3));
  }

  return {
    total: results.length,
    farmerLocation: { lat, lng },
    results
  };
}

// Government Schemes
export const MOCK_SCHEMES = [
  {
    _id: 'scheme_1',
    schemeName: 'Sub-Mission on Seeds and Planting Material (SMSP)',
    department: 'Department of Agriculture & Farmers Welfare, Govt of India / TN',
    description: 'Provides 50% subsidy on certified hybrid paddy, maize, and pulse seeds for small and marginal farmers across Tamil Nadu.',
    eligibility: 'All registered farmers holding agricultural land in Tamil Nadu.',
    benefits: '50% seed cost subsidy directly credited to bank account or provided at seed distribution centers.',
    requiredDocuments: 'Aadhaar Card, Land Record (Patta/Chitta), Bank Account Passbook Copy',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    officialLink: 'https://tnagrisnet.tn.gov.in/SMSP',
    status: 'ACTIVE'
  },
  {
    _id: 'scheme_2',
    schemeName: 'Kalaignarin All Village Cereal & Seed Mission',
    department: 'Tamil Nadu Agriculture Department',
    description: 'Free mini-kits of high-yielding vegetable and millet hybrid seeds for smallholder farmers across 12,525 panchayats.',
    eligibility: 'Small/marginal farmers, women farmers, and SC/ST farmers in TN.',
    benefits: '100% free distribution of seed kits containing tomato, chilli, brinjal, and maize seeds.',
    requiredDocuments: 'Aadhaar Card, Chitta Extract, Ration Card',
    startDate: '2026-05-15',
    endDate: '2026-12-31',
    officialLink: 'https://tnagrisnet.tn.gov.in/KalaignarAgri',
    status: 'ACTIVE'
  },
  {
    _id: 'scheme_3',
    schemeName: 'National Food Security Mission (NFSM) - Pulses & Oilseeds',
    department: 'Ministry of Agriculture and Farmers Welfare',
    description: 'Financial assistance of ₹40/kg for certified groundnut and pulse seeds to encourage crop diversification and improve soil health.',
    eligibility: 'Farmers practicing rainfed groundnut and pulse cultivation.',
    benefits: 'Direct financial subsidy of ₹40 per kg on certified seed purchases.',
    requiredDocuments: 'Aadhaar Card, Patta Copy, Bank Account Details',
    startDate: '2026-06-01',
    endDate: '2027-02-28',
    officialLink: 'https://nfsm.gov.in',
    status: 'ACTIVE'
  }
];

// Nearby Centers
export function getMockNearbyCenters(farmerLat = 11.0168, farmerLng = 76.9558, maxDistance = 50) {
  const centers = MOCK_SELLERS.map(seller => {
    const sellerSeeds = ALL_MOCK_SEEDS.filter(s => s.sellerId === seller._id);
    const distanceKm = calculateDistance(farmerLat, farmerLng, seller.latitude, seller.longitude);

    return {
      ...seller,
      distanceKm,
      seedsCount: sellerSeeds.length,
      availableSeeds: sellerSeeds.map(s => ({
        _id: s._id,
        seedName: s.seedName,
        crop: s.crop,
        hybridName: s.hybridName,
        currentStock: s.availableQuantity,
        unit: s.unit,
        status: s.stockStatus
      }))
    };
  })
  .filter(c => c.distanceKm <= maxDistance)
  .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    farmerLocation: { lat: farmerLat, lng: farmerLng },
    centers
  };
}
