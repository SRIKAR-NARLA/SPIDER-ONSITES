import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import AppError from './appError.js';

// Protected routes

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    //Read jwt from cookie
    token = req.cookies.jwt;
    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        }catch(error){
            throw new AppError('Not authorized, token failed',401)
        }
    }else{
        throw new AppError('Not authorized, no token',401)
    }
})

// Artist middleware

const artist = (req,res,next)=>{
    if(req.user && req.user.role==='artist'){
        next();
    }else{
        throw new AppError('Not authorized as admin',401)
    }
}

// Admin middleware

const admin = (req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    }else{
        throw new AppError('Not authorized as admin',401)
    }
}

export {protect,admin};