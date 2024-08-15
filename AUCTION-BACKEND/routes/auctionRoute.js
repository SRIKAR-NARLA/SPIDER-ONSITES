import express from 'express';
import {startAuction,endAuction,getAllBids,getBidsByCategory,placeBid} from '../controllers/auctionController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/:id/start', protect, startAuction);
router.post('/:id/end', protect, endAuction);
router.get('/:id/bids', protect,getAllBids);
router.get('/bids/category/:category', protect,getBidsByCategory);
router.post('/:id/bid', protect, placeBid);

export default router;
