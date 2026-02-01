import { pool } from './src/config/database.js';

const categoryData = {
    Men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Kurtas', 'Sherwanis', 'Jackets', 'Sweaters', 'Woollen Clothes', 'Ethnic Wear'],
    Women: ['Sarees', 'Salwar Kameez', 'Kurtis', 'Lehengas', 'Dupattas', 'Tops', 'Jeans', 'Palazzo', 'Ethnic Wear', 'Western Wear', 'Blouses', 'Shawls'],
    Kids: ['T-Shirts', 'Shirts', 'Jeans', 'Frocks', 'Ethnic Wear', 'Party Wear', 'Casual Wear', 'Sweaters', 'Jackets', 'Shorts'],
    Unisex: ['Accessories', 'Scarves', 'Stoles']
};

async function seed() {
    try {
        console.log('Seeding categories...');
        for (const [gender, names] of Object.entries(categoryData)) {
            for (const name of names) {
                const slug = `${gender.toLowerCase()}-${name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`;
                await pool.query(
                    'INSERT INTO categories (name, slug, gender) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING',
                    [name, slug, gender]
                );
            }
        }
        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        process.exit();
    }
}

seed();
