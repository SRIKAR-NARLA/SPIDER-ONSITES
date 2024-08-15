// models/itemModel.js
import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [String], 
    startingPrice: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, 
        required: true,
    },
    inAuction:{
        type:Boolean,
        required:true
    },
    category: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
}, {
    timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
