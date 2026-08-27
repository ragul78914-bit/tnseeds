const express = require('express');
const router = express.Router();
const { getSellerSeeds, createSeed, updateSeed, toggleSeedStatus } = require('../controllers/seedController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/seller', protect, authorize('SELLER', 'ADMIN'), getSellerSeeds);
router.post('/', protect, authorize('SELLER', 'ADMIN'), createSeed);
router.put('/:id', protect, authorize('SELLER', 'ADMIN'), updateSeed);
router.patch('/:id/toggle', protect, authorize('SELLER', 'ADMIN'), toggleSeedStatus);

module.exports = router;
