import express from 'express';
import { body } from 'express-validator';
import { signup, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect, restrictTo } from '../utils/auth.js';

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('passwordConfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Please provide a password')
];

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/logout', logout);

// Protected routes (require authentication)
router.use(protect);

// Get current user data
router.get('/me', getMe);

// Admin routes
router.use(restrictTo('admin'));
// Add admin-only routes here

export default router;
