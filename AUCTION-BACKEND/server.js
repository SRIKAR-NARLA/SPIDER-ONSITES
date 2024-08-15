import express from 'express';
import userRoutes from './routes/userRoute.js'
import itemRoutes from './routes/itemRoute.js'
import auctionRoutes from './routes/auctionRoute.js'
import feedbackRoutes from './routes/feedbackRoute.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import AppError from './middleware/appError.js'
import errorHandler from './middleware/errorHandler.js'
import './utils/cronjobs.js';
dotenv.config();

const port = process.env.PORT || 8000;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('API is running...')
})

app.use('/api/users',userRoutes);
app.use('/api/items',itemRoutes);
app.use('/api/auction',auctionRoutes);
app.use('/api/feedback',feedbackRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))