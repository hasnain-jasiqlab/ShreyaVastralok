import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log('Supabase Key Role:', supabaseKey ? (supabaseKey.includes('service_role') ? 'service_role' : 'anon') : 'missing');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// File upload function
const uploadFile = async (bucketName, filePath, fileBuffer, fileType) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: fileType
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      data: {
        ...data,
        publicUrl
      }
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// File delete function
const deleteFile = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get public URL for a file
const getPublicUrl = (bucketName, filePath) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
};

export {
  supabase,
  uploadFile,
  deleteFile,
  getPublicUrl
};
