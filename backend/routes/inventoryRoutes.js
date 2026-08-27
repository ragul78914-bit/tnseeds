const express = require('express');
const router = express.Router();
const { createStockTransaction, getInventoryTable, getTransactionHistory } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/table', protect, authorize('SELLER', 'ADMIN'), getInventoryTable);
router.get('/history', protect, authorize('SELLER', 'ADMIN'), getTransactionHistory);
router.post('/transaction', protect, authorize('SELLER', 'ADMIN'), createStockTransaction);

module.exports = router;
