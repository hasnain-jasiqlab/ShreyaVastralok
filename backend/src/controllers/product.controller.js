import { pool } from '../config/database.js';
import { uploadFile, deleteFile, getPublicUrl } from '../config/supabase.js';
import AppError from '../utils/appError.js';

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const { category, featured, search, sort, showInactive } = req.query;
        let query = `
      SELECT p.*, c.name as category_name, 
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as image,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image,
      (SELECT json_agg(json_build_object('id', id, 'image_url', image_url, 'is_primary', is_primary) ORDER BY is_primary DESC, id ASC) 
       FROM product_images WHERE product_id = p.id) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

        if (showInactive !== 'true' || !req.user || req.user.role !== 'admin') {
            query += ` AND p.is_active = true`;
        }
        const params = [];

        if (req.query.gender) {
            params.push(req.query.gender);
            query += ` AND (p.gender = $${params.length} OR c.gender = $${params.length})`;
        }

        if (category) {
            params.push(category);
            query += ` AND (c.slug = $${params.length} OR c.name = $${params.length})`;
        }

        if (featured === 'true') {
            query += ` AND p.is_featured = true`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
        }

        // Sorting
        if (sort === 'price-low') {
            query += ` ORDER BY p.price ASC`;
        } else if (sort === 'price-high') {
            query += ` ORDER BY p.price DESC`;
        } else if (sort === 'newest') {
            query += ` ORDER BY p.created_at DESC`;
        } else {
            query += ` ORDER BY p.name ASC`;
        }

        const result = await pool.query(query, params);

        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const productResult = await pool.query(
            `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
            [id]
        );

        if (productResult.rows.length === 0) {
            return next(new AppError('Product not found', 404));
        }

        const product = productResult.rows[0];

        // Get images
        const imagesResult = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC',
            [id]
        );
        product.images = imagesResult.rows;

        // Get variants
        const variantsResult = await pool.query(
            'SELECT * FROM variants WHERE product_id = $1',
            [id]
        );
        product.variants = variantsResult.rows;

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Create product
export const createProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const {
            name, description, price, compare_at_price,
            sku, barcode, quantity, category_id,
            is_featured, variants, gender
        } = req.body;

        const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const slug = `${baseSlug}-${Date.now()}`;

        const productResult = await client.query(
            `INSERT INTO products (name, slug, description, price, compare_at_price, sku, barcode, quantity, category_id, is_featured, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
            [name, slug, description, price, compare_at_price, sku, barcode, quantity || 0, category_id, is_featured || false, gender]
        );

        const product = productResult.rows[0];

        // Handle variants if provided
        if (variants && Array.isArray(variants)) {
            for (const variant of variants) {
                await client.query(
                    `INSERT INTO variants (product_id, name, value, price_adjustment, sku, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [product.id, variant.name, variant.value, variant.price_adjustment || 0, variant.sku, variant.quantity || 0]
                );
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// Update product
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.name) {
            updates.slug = updates.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Construct dynamic query
        const fields = Object.keys(updates).filter(key => key !== 'variants');
        if (fields.length === 0 && !updates.variants) {
            return next(new AppError('No update data provided', 400));
        }

        if (fields.length > 0) {
            const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
            const params = [id, ...fields.map(field => updates[field])];

            await pool.query(
                `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
                params
            );
        }

        // Handle variants if provided
        if (updates.variants && Array.isArray(updates.variants)) {
            // Basic variant sync logic could be added here
        }

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // In a real app, you might want to delete images from Supabase here too
        const images = await pool.query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);

        // Delete from DB
        await pool.query('DELETE FROM products WHERE id = $1', [id]);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

// Upload product images
export const uploadProductImages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return next(new AppError('Please upload at least one image', 400));
        }

        const uploadedImages = [];

        for (const file of files) {
            const fileName = `products/${id}/${Date.now()}-${file.originalname}`;
            const result = await uploadFile(
                process.env.SUPABASE_BUCKET || 'images',
                fileName,
                file.buffer,
                file.mimetype
            );

            if (result.success) {
                // Check if this is the first image for the product
                const existingImages = await pool.query('SELECT id FROM product_images WHERE product_id = $1', [id]);
                const isPrimary = existingImages.rows.length === 0;

                const dbResult = await pool.query(
                    `INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
                    [id, result.data.publicUrl, file.originalname, isPrimary]
                );
                uploadedImages.push(dbResult.rows[0]);
            } else {
                // If upload fails, throw error to stop the process and inform user
                console.error('Upload failed:', result.error);
                return next(new AppError(`Failed to upload ${file.originalname}: ${result.error}`, 500));
            }
        }

        res.status(200).json({
            status: 'success',
            data: uploadedImages
        });
    } catch (error) {
        next(error);
    }
};

// Set primary image
export const setPrimaryImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { imageId } = req.body;

        await pool.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [id]);
        await pool.query('UPDATE product_images SET is_primary = true WHERE id = $1 AND product_id = $2', [imageId, id]);

        res.status(200).json({
            status: 'success',
            message: 'Primary image updated'
        });
    } catch (error) {
        next(error);
    }
};

// Delete product image
export const deleteProductImage = async (req, res, next) => {
    try {
        const { id, imageId } = req.params;

        const result = await pool.query('SELECT image_url FROM product_images WHERE id = $1 AND product_id = $2', [imageId, id]);
        if (result.rows.length === 0) {
            return next(new AppError('Image not found', 404));
        }

        const imageUrl = result.rows[0].image_url;
        // Extract file path from URL to delete from Supabase if needed
        // For now, let's just remove from DB

        await pool.query('DELETE FROM product_images WHERE id = $1', [imageId]);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
// Get featured products
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const query = `
      SELECT p.*, c.name as category_name, 
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as image,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.is_featured = true
      ORDER BY p.created_at DESC
    `;
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

// Get new arrivals
export const getNewArrivals = async (req, res, next) => {
    try {
        const query = `
      SELECT p.*, c.name as category_name, 
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as image,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 8
    `;
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
