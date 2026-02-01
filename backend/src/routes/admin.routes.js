import express from 'express';
import { protect, restrictTo } from '../utils/auth.js';
import { pool } from '../config/database.js';

const router = express.Router();

// All admin routes are protected and restricted to admin
router.use(protect);
router.use(restrictTo('admin'));

// Stats dashboard
router.get('/stats', async (req, res, next) => {
    try {
        const productStats = await pool.query('SELECT COUNT(*) FROM products');
        const collectionStats = await pool.query('SELECT COUNT(*) FROM collections');
        const offerStats = await pool.query('SELECT COUNT(*) FROM offers WHERE is_active = true');
        const enquiryStats = await pool.query('SELECT COUNT(*) FROM contact_messages WHERE status = \'unread\'');

        const recentProducts = await pool.query(`
            SELECT p.*, c.name as category_name,
            (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as image,
            (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.created_at DESC LIMIT 5
        `);

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    products: parseInt(productStats.rows[0].count),
                    collections: parseInt(collectionStats.rows[0].count),
                    offers: parseInt(offerStats.rows[0].count),
                    enquiries: parseInt(enquiryStats.rows[0].count)
                },
                recentProducts: recentProducts.rows
            }
        });
    } catch (error) {
        next(error);
    }
});

// User management
router.get('/users', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
        res.status(200).json({
            status: 'success',
            data: { users: result.rows }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
