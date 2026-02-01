import { supabase } from './src/config/supabase.js';

async function testSupabase() {
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('Error listing buckets:', error);
        } else {
            console.log('Buckets:', JSON.stringify(data, null, 2));
            const bucketNames = data.map(b => b.name);
            const targetBucket = process.env.SUPABASE_BUCKET || 'products';
            console.log('Target Bucket:', targetBucket);
            console.log('Target exists:', bucketNames.includes(targetBucket));
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        process.exit();
    }
}

testSupabase();
