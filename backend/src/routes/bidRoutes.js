const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBid } = require('../validators/bidValidator');

router.use(authMiddleware);

router.post('/', validateBid, bidController.placeBid);
router.get('/user', bidController.getUserBids);
router.get('/:id', bidController.getBidById);
router.patch('/:id', bidController.updateBid);

module.exports = router;
