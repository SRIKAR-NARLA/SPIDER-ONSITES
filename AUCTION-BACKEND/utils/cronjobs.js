import cron from 'node-cron';
import Auction from '../models/auctionModel.js';
import Item from '../models/itemModel.js';
import transporter from '../config/mailer.js';

cron.schedule('* * * * *', async () => {
    const now = new Date();

    const auctions = await Auction.find({ endTime: { $lte: now }, status: 'active' })
                                  .populate('bids.bidder', 'email name')
                                  .populate('item', 'name owner');

    for (const auction of auctions) {
        const biddersEmails = auction.bids.map(bid => bid.bidder.email);

        if (biddersEmails.length > 0) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: biddersEmails.join(','), 
                subject: `Auction Ended: ${auction.item.name}`,
                text: `Dear bidder,\n\nThe auction for ${auction.item.name} has ended. The highest bid was ${auction.highestBid}.\n\nThank you for participating.\n\nBest regards,\nAuction Platform`,
            };

            await transporter.sendMail(mailOptions);
        }

        auction.status = 'closed';

        if (auction.highestBidder) {
            const item = await Item.findById(auction.item);
            item.owner = auction.highestBidder;
            item.startingPrice= auction.highestBid;
            item.inAuction = false;
            await item.save();
        }

        await auction.save();
    }
});
