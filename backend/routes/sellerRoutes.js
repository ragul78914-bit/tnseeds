const express = require('express');
const router = express.Router();
const { getSellerDashboard, updateSellerProfile, getSuppliers, addSupplier } = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('SELLER', 'ADMIN'), getSellerDashboard);
router.put('/profile', protect, authorize('SELLER', 'ADMIN'), updateSellerProfile);
router.get('/suppliers', protect, authorize('SELLER', 'ADMIN'), getSuppliers);
router.post('/suppliers', protect, authorize('SELLER', 'ADMIN'), addSupplier);

module.exports = router;
