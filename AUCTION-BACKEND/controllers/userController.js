import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import AppError from '../middleware/appError.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import transporter from '../config/mailer.js' 

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
        if (!user.is_verified) {
            throw new AppError('Please verify your email before logging in', 403);
        }
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        throw new AppError('Invalid credentials', 404);
    }
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists', 400);
    }

    const user = await User.create({
        name,
        email,
        password,
        is_verified: false, 
    });

    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Verification',
            html: `
                <h1>Email Verification</h1>
                <p>Thank you for registering. Please click the link below to verify your email:</p>
                <a href="${verificationUrl}">Verify Email</a>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
        });
    } else {
        throw new AppError('Invalid user data', 400);
    }
});

// @desc Verify user email
// @route GET /api/users/verify/:token
// @access Public
const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new AppError('Invalid token', 400);
        }

        user.is_verified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        throw new AppError('Invalid or expired token', 400);
    }
});

// @desc Logout user and clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
});

export { authUser, registerUser, logoutUser, verifyUser };
