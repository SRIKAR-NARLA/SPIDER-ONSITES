import asyncHandler from '../middleware/asyncHandler.js';
import Feedback from '../models/feedbackModel.js';
import AppError from '../middleware/appError.js';

// @desc Submit feedback
// @route POST /api/feedback
// @access Private
const submitFeedback = asyncHandler(async (req, res) => {
    const { auction, toUser, rating, comment } = req.body;
    const fromUser = req.user._id;

    const existingFeedback = await Feedback.findOne({
        auction,
        fromUser,
        toUser
    });

    if (existingFeedback) {
        throw new AppError('Feedback already submitted for this auction from you to this user', 400);
    }

    if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
    }

    const feedback = await Feedback.create({
        auction,
        fromUser,
        toUser,
        rating,
        comment
    });

    res.status(201).json(feedback);
});


// @desc Get feedback by auction ID
// @route GET /api/feedback/:auctionId
// @access Private
const getFeedbackByAuction = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ auction: req.params.auctionId });

    if (!feedback) {
        throw new AppError('Feedback not found', 404);
    }

    res.json(feedback);
});

// @desc Update feedback
// @route PUT /api/feedback/:feedbackId
// @access Private
const updateFeedback = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const feedback = await Feedback.findById(req.params.feedbackId);

    if (!feedback) {
        throw new AppError('Feedback not found', 404);
    }

    // Ensure the user is the one who submitted the feedback
    if (feedback.fromUser.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to update this feedback', 403);
    }

    feedback.rating = rating || feedback.rating;
    feedback.comment = comment || feedback.comment;

    const updatedFeedback = await feedback.save();

    res.json(updatedFeedback);
});

// @desc Delete feedback
// @route DELETE /api/feedback/:feedbackId
// @access Private
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.feedbackId);

    if (!feedback) {
        throw new AppError('Feedback not found', 404);
    }

        if (feedback.fromUser.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to delete this feedback', 403);
    }

    await Feedback.findByIdAndDelete(req.params.feedbackId);

    res.json({ message: 'Feedback removed' });
});

// @desc Get average rating for a user
// @route GET /api/feedback/user/:userId/average-rating
// @access Public
const getAverageRatingForUser = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ toUser: req.params.userId });

    if (feedbacks.length === 0) {
        throw new AppError('No feedback found for this user', 404);
    }

    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;

    res.json({ averageRating });
});

export {submitFeedback,getAverageRatingForUser,updateFeedback,deleteFeedback,getFeedbackByAuction}