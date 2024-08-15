import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    highestBid: {
        type: Number,
        default: 0
    },
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    bids: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bidAmount: {
            type: Number,
            required: true
        },
        bidTime: {
            type: Date,
            default: Date.now
        }
    }],
    buyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;
