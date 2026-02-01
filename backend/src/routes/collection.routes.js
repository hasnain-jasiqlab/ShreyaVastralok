import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { protect, restrictTo, isLoggedIn } from '../utils/auth.js';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  uploadCollectionImage,
  getFeaturedCollections,
  toggleFeatured
} from '../controllers/collection.controller.js';

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
router.get('/', isLoggedIn, getAllCollections);
router.get('/featured', isLoggedIn, getFeaturedCollections);
router.get('/:id', isLoggedIn, getCollectionById);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(restrictTo('admin'));

// Collection CRUD operations
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Collection name is required'),
    body('description').optional(),
    body('is_active').optional().isBoolean(),
    body('product_ids').optional().isArray(),
    body('product_ids.*').isInt({ min: 1 }).withMessage('Invalid product ID')
  ],
  createCollection
);

router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid collection ID'),
    body('name').optional().notEmpty().withMessage('Collection name cannot be empty'),
    body('description').optional(),
    body('is_active').optional().isBoolean(),
    body('product_ids').optional().isArray(),
    body('product_ids.*').isInt({ min: 1 }).withMessage('Invalid product ID')
  ],
  updateCollection
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid collection ID')],
  deleteCollection
);

// Collection image upload
router.post(
  '/:id/image',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid collection ID'),
    upload.single('image')
  ],
  uploadCollectionImage
);

// Toggle featured status
router.patch('/:id/featured', toggleFeatured);

export default router;

