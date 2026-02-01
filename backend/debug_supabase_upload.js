
import { uploadFile } from './src/config/supabase.js';

async function testUpload() {
    console.log('Testing Supabase upload...');
    const buffer = Buffer.from('test image content');
    const timestamp = Date.now();
    const fileName = `collections/debug_test/${timestamp}.txt`;

    try {
        const result = await uploadFile('images', fileName, buffer, 'text/plain');
        console.log('Upload Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Upload Failed:', error);
    }
}

testUpload();
