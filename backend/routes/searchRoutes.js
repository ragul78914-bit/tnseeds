const express = require('express');
const router = express.Router();
const { searchSeeds, getSeedById, getCropsAndCategories, getNearbyCenters } = require('../controllers/searchController');

router.get('/', searchSeeds);
router.get('/meta', getCropsAndCategories);
router.get('/nearby', getNearbyCenters);
router.get('/:id', getSeedById);

module.exports = router;
