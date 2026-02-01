import { supabase } from './src/config/supabase.js';

async function setupStorage() {
    try {
        console.log('Checking buckets...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('Error listing buckets:', listError.message);
            return;
        }

        console.log('Current buckets:', buckets.map(b => b.name));

        const bucketName = process.env.SUPABASE_BUCKET || 'images';
        const exists = buckets.find(b => b.name === bucketName);

        if (!exists) {
            console.log(`Bucket "${bucketName}" does not exist. Attempting to create...`);
            const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (createError) {
                console.error('Error creating bucket:', createError.message);
                console.log('This usually means you are using an "anon" key. Please use the "service_role" key in your .env file.');
            } else {
                console.log('Bucket created successfully:', data);
            }
        } else {
            console.log(`Bucket "${bucketName}" already exists.`);
            if (!exists.public) {
                console.log('WARNING: Bucket is not public. Images will not be visible on the frontend.');
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        process.exit();
    }
}

setupStorage();
