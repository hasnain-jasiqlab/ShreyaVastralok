import { uploadFile } from './src/config/supabase.js';
import 'dotenv/config';

async function testUpload() {
    console.log('Testing upload to bucket:', process.env.SUPABASE_BUCKET || 'images');
    const result = await uploadFile(
        process.env.SUPABASE_BUCKET || 'images',
        'test-debug.txt',
        Buffer.from('hello world'),
        'text/plain'
    );
    console.log('Result:', JSON.stringify(result, null, 2));
    process.exit();
}

testUpload();
