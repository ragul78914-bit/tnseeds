const express = require('express');
const router = express.Router();
const { getSchemes, createScheme } = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSchemes);
router.post('/', protect, authorize('ADMIN'), createScheme);

module.exports = router;
