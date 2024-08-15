import asyncHandler from '../middleware/asyncHandler.js';
import Item from '../models/itemModel.js';
import AppError from '../middleware/appError.js';

// @desc Create an item for auction
// @route POST /api/items
// @access Private
const createItem = asyncHandler(async (req, res) => {
    const { title, description, images, startingPrice, duration, category } = req.body;

    const item = await Item.create({
        title,
        description,
        images,
        startingPrice,
        duration,
        inAuction: false, // Ensure inAuction is set to false by default
        category,
        owner: req.user._id, // Ensure consistent field name
    });

    res.status(201).json(item);
});

// @desc Update an item
// @route PUT /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res) => {
    const { title, description, images, startingPrice, duration, category } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
        throw new AppError('Item not found', 404);
    }

    // Ensure the user is the owner of the item
    if (item.owner.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to update this item', 403);
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.images = images || item.images;
    item.startingPrice = startingPrice || item.startingPrice;
    item.duration = duration || item.duration;
    item.category = category || item.category;

    const updatedItem = await item.save();

    res.json(updatedItem);
});

// @desc Delete an item
// @route DELETE /api/items/:id
// @access Private
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        throw new AppError('Item not found', 404);
    }

    if (item.owner.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to delete this item', 403);
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item removed' });
});

// @desc Get all items of the logged-in user
// @route GET /api/items/my-items
// @access Private
const getMyItems = asyncHandler(async (req, res) => {
    const items = await Item.find({ owner: req.user._id }); // Ensure consistent field name

    res.json(items);
});

// @desc Search items by category
// @route GET /api/items/category/:category
// @access Public
const getItemsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const items = await Item.find({ category });

    if (items.length === 0) {
        throw new AppError('No items found in this category', 404);
    }

    res.json(items);
});

export { createItem, updateItem, deleteItem, getMyItems, getItemsByCategory };
