import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating of 1
        max: 5  // Maximum rating of 5
    },
    comment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
