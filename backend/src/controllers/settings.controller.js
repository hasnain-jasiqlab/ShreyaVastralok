import { pool } from '../config/database.js';

// Get current announcement
export const getAnnouncement = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM announcements ORDER BY id DESC LIMIT 1'
        );

        if (result.rows.length === 0) {
            // Return default if no announcement exists
            return res.status(200).json({
                status: 'success',
                data: {
                    enabled: false,
                    message: '',
                    type: 'info'
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Update or create announcement
export const updateAnnouncement = async (req, res, next) => {
    try {
        const { enabled, message, type } = req.body;

        // Check if announcement exists
        const existing = await pool.query('SELECT id FROM announcements LIMIT 1');

        let result;
        if (existing.rows.length > 0) {
            // Update existing
            result = await pool.query(
                `UPDATE announcements 
                 SET enabled = $1, message = $2, type = $3, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $4
                 RETURNING *`,
                [enabled, message, type || 'info', existing.rows[0].id]
            );
        } else {
            // Create new
            result = await pool.query(
                `INSERT INTO announcements (enabled, message, type) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [enabled, message, type || 'info']
            );
        }

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
