import { pool } from './src/config/database.js';

async function checkConstraints() {
    try {
        const result = await pool.query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'collections'::regclass
        `);
        console.log('Constraints:', JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkConstraints();
