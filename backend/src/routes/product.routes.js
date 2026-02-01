import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { protect, restrictTo, isLoggedIn } from '../utils/auth.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  setPrimaryImage,
  deleteProductImage,
  getFeaturedProducts, // Added
  getNewArrivals      // Added
} from '../controllers/product.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes
router.get('/', isLoggedIn, getAllProducts);
router.get('/featured', isLoggedIn, getFeaturedProducts); // Added
router.get('/new-arrivals', isLoggedIn, getNewArrivals);  // Added
router.get('/:id', isLoggedIn, getProductById);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(restrictTo('admin'));

// Product CRUD operations
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').optional(),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be a positive number'),
    body('compare_at_price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Compare at price must be a positive number'),
    body('sku').optional(),
    body('barcode').optional(),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('category_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Invalid category ID'),
    body('is_featured').optional().isBoolean(),
    body('variants').optional().isArray(),
    body('variants.*.name').notEmpty().withMessage('Variant name is required'),
    body('variants.*.value').notEmpty().withMessage('Variant value is required'),
    body('variants.*.price_adjustment')
      .optional()
      .isNumeric()
      .withMessage('Price adjustment must be a number'),
    body('variants.*.sku').optional(),
    body('variants.*.quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Variant quantity must be a non-negative integer')
  ],
  createProduct
);

router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('description').optional(),
    body('price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Price must be a positive number'),
    body('compare_at_price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Compare at price must be a positive number'),
    body('sku').optional(),
    body('barcode').optional(),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('category_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Invalid category ID'),
    body('is_featured').optional().isBoolean(),
    body('is_active').optional().isBoolean(),
    body('variants').optional().isArray(),
    body('variants.*.name')
      .if((value, { req }) => req.body.variants)
      .notEmpty()
      .withMessage('Variant name is required'),
    body('variants.*.value')
      .if((value, { req }) => req.body.variants)
      .notEmpty()
      .withMessage('Variant value is required'),
    body('variants.*.price_adjustment')
      .optional()
      .isNumeric()
      .withMessage('Price adjustment must be a number'),
    body('variants.*.sku').optional(),
    body('variants.*.quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Variant quantity must be a non-negative integer')
  ],
  updateProduct
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid product ID')],
  deleteProduct
);

// Product images
router.post(
  '/:id/images',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    upload.array('images', 10) // Max 10 images
  ],
  uploadProductImages
);

router.patch(
  '/:id/images/primary',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    body('imageId').isInt({ min: 1 }).withMessage('Valid image ID is required')
  ],
  setPrimaryImage
);

router.delete(
  '/:id/images/:imageId',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
    param('imageId').isInt({ min: 1 }).withMessage('Invalid image ID')
  ],
  deleteProductImage
);

export default router;
