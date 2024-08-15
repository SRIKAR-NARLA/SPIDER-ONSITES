import express from 'express';
import { submitFeedback, getAverageRatingForUser, updateFeedback, deleteFeedback, getFeedbackByAuction } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitFeedback);
router.route('/:feedbackId').put(protect,updateFeedback).delete(protect,deleteFeedback); 
router.get('/:auctionId', protect,getFeedbackByAuction); 
router.get('/user/:userId/average-rating', getAverageRatingForUser); 

export default router;