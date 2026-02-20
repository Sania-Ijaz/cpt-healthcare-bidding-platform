const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.get('/user/:id/bids', adminController.getUserBids);
router.get('/bids', adminController.getAllBids);
router.patch('/bid/:id', adminController.updateBidStatus);

module.exports = router;
