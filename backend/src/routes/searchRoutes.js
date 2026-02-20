const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearch } = require('../validators/searchValidator');

router.get('/', validateSearch, searchController.search);

module.exports = router;
