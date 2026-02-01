import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    const client = await pool.connect();
    try {
        const collections = await client.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'collections'");
        console.log('Collections columns:', collections.rows);
        const offers = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'offers'");
        console.log('Offers table exists:', offers.rows.length > 0);
    } finally {
        client.release();
        await pool.end();
    }
}
check();
