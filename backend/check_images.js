import { pool } from './src/config/database.js';

async function checkImages() {
    try {
        const res = await pool.query(`
            SELECT p.name, pi.image_url, pi.is_primary 
            FROM products p 
            LEFT JOIN product_images pi ON p.id = pi.product_id
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkImages();
