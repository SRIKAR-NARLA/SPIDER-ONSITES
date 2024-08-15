import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import {authUser,registerUser,logoutUser,verifyUser} from '../controllers/userController.js';

router.route('/register').post(registerUser);
router.route('/logout').post(logoutUser);
router.route('/auth').post(authUser);
router.get('/verify/:token', verifyUser);

export default router;