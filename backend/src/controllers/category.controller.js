import { pool } from '../config/database.js';
import { uploadFile } from '../config/supabase.js';
import AppError from '../utils/appError.js';

export const getAllCategories = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, description, gender } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const result = await pool.query(
            'INSERT INTO categories (name, slug, description, gender) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, slug, description, gender]
        );

        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, gender } = req.body;

        const result = await pool.query(
            'UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description), gender = COALESCE($3, gender), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [name, description, gender, id]
        );

        if (result.rows.length === 0) {
            return next(new AppError('Category not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return next(new AppError('Category not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const uploadCategoryImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return next(new AppError('Please upload an image', 400));
        }

        const fileName = `categories/${id}/${Date.now()}-${file.originalname}`;
        const result = await uploadFile(
            process.env.SUPABASE_BUCKET || 'categories',
            fileName,
            file.buffer,
            file.mimetype
        );

        if (result.success) {
            await pool.query(
                'UPDATE categories SET image_url = $1 WHERE id = $2',
                [result.data.publicUrl, id]
            );

            res.status(200).json({
                status: 'success',
                data: { image_url: result.data.publicUrl }
            });
        } else {
            return next(new AppError(result.error, 500));
        }
    } catch (error) {
        next(error);
    }
};
