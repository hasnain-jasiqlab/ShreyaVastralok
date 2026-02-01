import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setAdmin() {
    const client = await pool.connect();
    try {
        const email = 'mdhasnainraza2003@gmail.com';

        // Check if user exists
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            console.log(`User ${email} not found in database. Trying to insert...`);
            await client.query(
                "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)",
                ['Admin', email, 'admin', 'supabase_managed']
            );
            console.log(`User ${email} created as admin.`);
        } else {
            await client.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
            console.log(`User ${email} updated to admin role.`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

setAdmin();
