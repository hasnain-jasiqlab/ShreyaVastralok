import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { protect, restrictTo } from '../utils/auth.js';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage
} from '../controllers/category.controller.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getAllCategories);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.post('/:id/image', upload.single('image'), uploadCategoryImage);

export default router;
