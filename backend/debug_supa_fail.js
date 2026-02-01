
import { uploadFile } from './src/config/supabase.js';

async function testUpload() {
    console.log('Testing Supabase upload fail...');
    try {
        const result = await uploadFile('non_existent_bucket', 'test.txt', Buffer.from('test'), 'text/plain');
        console.log('Result:', result);
    } catch (error) {
        console.error('Caught Error:', error);
    }
}

testUpload();
