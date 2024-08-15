import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import {createItem,updateItem,deleteItem,getItemsByCategory,getMyItems} from '../controllers/itemController.js';

router.route('/').post(protect,createItem);
router.route('/:id').put(protect,updateItem).delete(protect,deleteItem);
router.route('/my-items').post(protect,getMyItems);
router.route('/my-items/:category').post(protect,getItemsByCategory);

export default router;
