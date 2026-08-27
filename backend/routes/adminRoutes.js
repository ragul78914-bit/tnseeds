const express = require('express');
const router = express.Router();
const { getAdminDashboard, toggleSellerStatus, getAllSellers, getAllFarmers, getAuditLogs } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('ADMIN'), getAdminDashboard);
router.get('/sellers', protect, authorize('ADMIN'), getAllSellers);
router.patch('/sellers/:sellerId/toggle', protect, authorize('ADMIN'), toggleSellerStatus);
router.get('/farmers', protect, authorize('ADMIN'), getAllFarmers);
router.get('/audit-logs', protect, authorize('ADMIN'), getAuditLogs);

module.exports = router;
