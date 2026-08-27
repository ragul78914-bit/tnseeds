const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Seller = require('../models/Seller');
const { isInMemoryMode, getMemoryStore } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_tnseeds_2026_nixtion', {
    expiresIn: '30d'
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, businessName, district, taluk, village, pincode, latitude, longitude, licenseNo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      if (store.users.some(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = 'u_' + Date.now();
      const user = {
        _id: userId,
        name,
        email,
        password: hashedPassword,
        role: role || 'FARMER',
        phone: phone || '',
        status: 'ACTIVE',
        createdAt: new Date()
      };
      store.users.push(user);

      if (user.role === 'SELLER') {
        const sellerId = 's_' + Date.now();
        const seller = {
          _id: sellerId,
          userId,
          businessName: businessName || `${name} Agri Center`,
          ownerName: name,
          phone: phone || '9876543210',
          email,
          address: `${village || 'Main Road'}, ${taluk || 'Coimbatore North'}, ${district || 'Coimbatore'}`,
          district: district || 'Coimbatore',
          taluk: taluk || 'Coimbatore North',
          village: village || '',
          pincode: pincode || '641001',
          latitude: latitude || 11.0168,
          longitude: longitude || 76.9558,
          licenseNo: licenseNo || `LIC-${Date.now().toString().slice(-6)}`,
          openingHours: '8:00 AM - 8:00 PM',
          status: 'ACTIVE',
          createdAt: new Date()
        };
        store.sellers.push(seller);
      } else if (user.role === 'FARMER') {
        const farmerId = 'f_' + Date.now();
        const farmer = {
          _id: farmerId,
          userId,
          name,
          phone: phone || '9876543210',
          district: district || 'Coimbatore',
          taluk: taluk || 'Coimbatore North',
          village: village || 'Perur',
          latitude: latitude || 11.0168,
          longitude: longitude || 76.9558,
          searchHistory: [],
          favoriteSeeds: [],
          createdAt: new Date()
        };
        store.farmers.push(farmer);
      }

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }

    // Mongoose MongoDB execution
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'FARMER',
      phone: phone || '',
      status: 'ACTIVE'
    });

    if (user.role === 'SELLER') {
      await Seller.create({
        userId: user._id,
        businessName: businessName || `${name} Seeds`,
        ownerName: name,
        phone: phone || '9876543210',
        email,
        address: `${village || 'Agri Bazar'}, ${district || 'Coimbatore'}`,
        district: district || 'Coimbatore',
        taluk: taluk || 'Coimbatore North',
        pincode: pincode || '641001',
        latitude: latitude || 11.0168,
        longitude: longitude || 76.9558,
        licenseNo: licenseNo || `LIC-${Date.now().toString().slice(-6)}`,
        status: 'ACTIVE'
      });
    } else if (user.role === 'FARMER') {
      await Farmer.create({
        userId: user._id,
        name,
        phone: phone || '9876543210',
        district: district || 'Coimbatore',
        taluk: taluk || 'Coimbatore North',
        latitude: latitude || 11.0168,
        longitude: longitude || 76.9558
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      const user = store.users.find(u => u.email === email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.status === 'INACTIVE') {
        return res.status(403).json({ message: 'Your account has been deactivated' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      let sellerInfo = null;
      let farmerInfo = null;

      if (user.role === 'SELLER') {
        sellerInfo = store.sellers.find(s => s.userId === user._id);
        if (sellerInfo && sellerInfo.status === 'INACTIVE') {
          return res.status(403).json({ message: 'Seller profile is inactive. Contact admin.' });
        }
      } else if (user.role === 'FARMER') {
        farmerInfo = store.farmers.find(f => f.userId === user._id);
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        seller: sellerInfo,
        farmer: farmerInfo,
        token: generateToken(user._id)
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    let sellerInfo = null;
    let farmerInfo = null;

    if (user.role === 'SELLER') {
      sellerInfo = await Seller.findOne({ userId: user._id });
      if (sellerInfo && sellerInfo.status === 'INACTIVE') {
        return res.status(403).json({ message: 'Seller profile is inactive. Contact admin.' });
      }
    } else if (user.role === 'FARMER') {
      farmerInfo = await Farmer.findOne({ userId: user._id });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      seller: sellerInfo,
      farmer: farmerInfo,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    let sellerInfo = null;
    let farmerInfo = null;

    if (isInMemoryMode()) {
      const store = getMemoryStore();
      if (user.role === 'SELLER') {
        sellerInfo = store.sellers.find(s => s.userId === user._id);
      } else if (user.role === 'FARMER') {
        farmerInfo = store.farmers.find(f => f.userId === user._id);
      }
    } else {
      if (user.role === 'SELLER') {
        sellerInfo = await Seller.findOne({ userId: user._id });
      } else if (user.role === 'FARMER') {
        farmerInfo = await Farmer.findOne({ userId: user._id });
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      seller: sellerInfo,
      farmer: farmerInfo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
