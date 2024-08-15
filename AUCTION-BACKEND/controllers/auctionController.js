import asyncHandler from '../middleware/asyncHandler.js';
import Auction from '../models/auctionModel.js';
import AppError from '../middleware/appError.js';
import Item from '../models/itemModel.js';
import transporter from '../config/mailer.js';


// @desc Start an auction
// @route POST /api/auctions/:itemId/start
// @access Private
const startAuction = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
        throw new AppError('Item not found', 404);
    }

    if (item.owner.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to start auction for this item', 403);
    }

    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + item.duration);

    const auction = await Auction.create({
        item: id,
        seller: req.user._id,
        startingPrice: item.startingPrice, 
        startTime: new Date(), 
        endTime,
        isActive: true,
        highestBid:item.startingPrice
    });

    item.inAuction = true;
    await item.save();

    res.status(201).json(auction);
});

// @desc End an auction
// @route POST /api/auctions/:id/end
// @access Private
const endAuction = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
        throw new AppError('Auction not found', 404);
    }

    if (auction.seller.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to end this auction', 403);
    }

    if (auction.status === 'closed') {
        throw new AppError('Auction is already closed', 400);
    }

    auction.endTime = new Date();
    auction.status = 'closed';
    
    await auction.save();
    
    res.json({ message: 'Auction ended successfully', auction });
});

// @desc Get all bids for a specific auction
// @route GET /api/auctions/:id/bids
// @access Public (or Private)
const getAllBids = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).populate('bids.bidder', 'name email');

    if (!auction) {
        throw new AppError('Auction not found', 404);
    }

    res.json(auction.bids);
});

// @desc Get bids by item category
// @route GET /api/bids/category/:category
// @access Public (or Private)
const getBidsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const items = await Item.find({ category });

    if (items.length === 0) {
        throw new AppError('No items found in this category', 404);
    }

    const auctions = await Auction.find({ item: { $in: items.map(item => item._id) } })
                                  .populate('bids.user', 'name email');

    if (auctions.length === 0) {
        throw new AppError('No auctions found for this category', 404);
    }

    const bids = auctions.flatMap(auction => auction.bids);

    res.json(bids);
});

// @desc Place a bid on an auction item
// @route POST /api/auctions/:id/bid
// @access Private
const placeBid = asyncHandler(async (req, res) => {
    const { bidAmount } = req.body;

    const auction = await Auction.findById(req.params.id)
        .populate('bids.bidder', 'email name')
        .populate('item', 'title');  

    if (!auction) {
        throw new AppError('Auction not found', 404);
    }

    if (auction.status !== 'active') {
        throw new AppError('Auction is not active', 400);
    }

    if (new Date() > auction.endTime) {
        throw new AppError('Auction has already ended', 400);
    }

    if (bidAmount <= auction.highestBid) {
        throw new AppError('Bid must be higher than the current highest bid', 400);
    }

    if (auction.seller.toString() === req.user._id.toString()) {
        throw new AppError('Seller cannot place a bid on their own auction', 403);
    }

    auction.bids.push({
        bidder: req.user._id,
        bidAmount,
    });

    auction.highestBid = bidAmount;
    auction.highestBidder = req.user._id;

    if (!auction.buyers.includes(req.user._id)) {
        auction.buyers.push(req.user._id);
    }

    await auction.save();

    const biddersEmails = auction.bids
        .map(bid => bid.bidder.email)
        .filter(email => email !== req.user.email); 
    if (biddersEmails.length > 0) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: biddersEmails.join(','), 
            subject: `New Bid Placed on ${auction.item.title}`,
            text: `Dear bidder,\n\nA new bid of ${bidAmount} has been placed on the auction for ${auction.item.title}.\n\nVisit the auction to place a higher bid.\n\nBest regards,\nAuction Platform`,
        };

        await transporter.sendMail(mailOptions);
    }

    res.json({
        message: 'Bid placed successfully',
        auction
    });
});


export {startAuction,endAuction,getAllBids,getBidsByCategory,placeBid };


