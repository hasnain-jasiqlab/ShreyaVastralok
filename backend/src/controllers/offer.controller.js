import { pool } from '../config/database.js';
import AppError from '../utils/appError.js';

export const getAllOffers = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveOffers = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM offers WHERE is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) ORDER BY created_at DESC'
        );
        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const createOffer = async (req, res, next) => {
    try {
        const { title, description, discount_percentage, image_url, start_date, end_date, is_active } = req.body;
        const result = await pool.query(
            'INSERT INTO offers (title, description, discount_percentage, image_url, start_date, end_date, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, discount_percentage, image_url, start_date, end_date, is_active !== undefined ? is_active : true]
        );
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
