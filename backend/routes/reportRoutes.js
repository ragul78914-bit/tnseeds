const express = require('express');
const router = express.Router();
const { getStockValuationReport, getStockMovementReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/valuation', protect, authorize('SELLER', 'ADMIN'), getStockValuationReport);
router.get('/movement', protect, authorize('SELLER', 'ADMIN'), getStockMovementReport);

module.exports = router;
