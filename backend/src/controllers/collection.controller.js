import { pool } from '../config/database.js';
import { uploadFile } from '../config/supabase.js';
import AppError from '../utils/appError.js';

export const getAllCollections = async (req, res, next) => {
    try {
        const { showInactive } = req.query;
        let query = 'SELECT * FROM collections WHERE 1=1';

        if (showInactive !== 'true' || !req.user || req.user.role !== 'admin') {
            query += ' AND is_active = true';
        }

        query += ' ORDER BY name ASC';

        const result = await pool.query(query);
        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const getCollectionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return next(new AppError('Collection not found', 404));
        }

        const collection = result.rows[0];

        // Get products in this collection
        const productsResult = await pool.query(
            `SELECT p.* FROM products p
       JOIN collection_products cp ON p.id = cp.product_id
       WHERE cp.collection_id = $1
       ORDER BY cp.sort_order ASC`,
            [id]
        );
        collection.products = productsResult.rows;

        res.status(200).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        next(error);
    }
};

export const createCollection = async (req, res, next) => {
    try {
        const { name, description, is_active } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const result = await pool.query(
            'INSERT INTO collections (name, slug, description, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, slug, description, is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, is_active } = req.body;

        const result = await pool.query(
            'UPDATE collections SET name = COALESCE($1, name), description = COALESCE($2, description), is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [name, description, is_active, id]
        );

        if (result.rows.length === 0) {
            return next(new AppError('Collection not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { collection: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM collections WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return next(new AppError('Collection not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const uploadCollectionImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return next(new AppError('Please upload an image', 400));
        }

        const fileName = `collections/${id}/${Date.now()}-${file.originalname}`;
        const result = await uploadFile(
            'images', // Use images bucket like products
            fileName,
            file.buffer,
            file.mimetype
        );

        if (result.success) {
            // Store just the path, not the full URL
            const imagePath = fileName;
            await pool.query(
                'UPDATE collections SET image_url = $1 WHERE id = $2',
                [imagePath, id]
            );

            res.status(200).json({
                status: 'success',
                data: { image_url: imagePath }
            });
        } else {
            return next(new AppError(result.error, 500));
        }
    } catch (error) {
        console.error('Upload Collection Image Error:', error);
        next(error);
    }
};
// Get featured collections
export const getFeaturedCollections = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM collections WHERE is_active = true AND featured = true ORDER BY name ASC LIMIT 4');
        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Toggle featured status
export const toggleFeatured = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get current featured status
        const current = await pool.query('SELECT featured FROM collections WHERE id = $1', [id]);

        if (current.rows.length === 0) {
            return next(new AppError('Collection not found', 404));
        }

        const newFeaturedStatus = !current.rows[0].featured;

        // Update featured status
        const result = await pool.query(
            'UPDATE collections SET featured = $1 WHERE id = $2 RETURNING *',
            [newFeaturedStatus, id]
        );

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

