import { supabase } from './supabase';

const POSTERS_BUCKET = 'posters';
const BACKDROPS_BUCKET = 'backdrops';

export type ImageType = 'poster' | 'backdrop';

/**
 * Verify that storage buckets exist
 * Logs warnings if buckets are missing
 */
export async function verifyStorageBuckets(): Promise<void> {
  try {
    console.log('verifyStorageBuckets - Checking storage buckets...');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('verifyStorageBuckets - Error listing buckets:', error);
      return;
    }
    
    const bucketNames = buckets?.map(b => b.name) || [];
    console.log('verifyStorageBuckets - Available buckets:', bucketNames);
    
    if (!bucketNames.includes(POSTERS_BUCKET)) {
      console.error(`verifyStorageBuckets - MISSING bucket: ${POSTERS_BUCKET}. Please create it in Supabase Storage.`);
    }
    
    if (!bucketNames.includes(BACKDROPS_BUCKET)) {
      console.error(`verifyStorageBuckets - MISSING bucket: ${BACKDROPS_BUCKET}. Please create it in Supabase Storage.`);
    }
    
    if (bucketNames.includes(POSTERS_BUCKET) && bucketNames.includes(BACKDROPS_BUCKET)) {
      console.log('verifyStorageBuckets - All required buckets exist');
    }
  } catch (error) {
    console.error('verifyStorageBuckets - Error:', error);
  }
}

/**
 * Upload an image to Supabase Storage
 * @param file The file to upload
 * @param type The type of image (poster or backdrop)
 * @param movieId The movie ID (used for folder organization)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  type: ImageType,
  movieId?: string
): Promise<string> {
  try {
    const bucket = type === 'poster' ? POSTERS_BUCKET : BACKDROPS_BUCKET;
    console.log(`uploadImage - Uploading ${type} to bucket: ${bucket}`);
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${movieId || crypto.randomUUID()}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`uploadImage - File path: ${filePath}, size: ${file.size} bytes`);

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(`uploadImage - Upload error for ${type}:`, uploadError);
      console.error('Upload error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
      });
      throw new Error(`Failed to upload ${type}: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error(`uploadImage - Failed to get public URL for ${type}`);
      throw new Error(`Failed to get public URL for ${type}`);
    }

    console.log(`uploadImage - Successfully uploaded ${type}:`, publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`uploadImage - Error uploading ${type}:`, error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url The public URL of the image to delete
 * @param type The type of image (poster or backdrop)
 */
export async function deleteImage(url: string, type: ImageType): Promise<void> {
  try {
    const bucket = type === 'poster' ? POSTERS_BUCKET : BACKDROPS_BUCKET;
    console.log(`deleteImage - Deleting ${type} from bucket: ${bucket}, URL: ${url}`);
    
    // Extract the file path from the URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/filename
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    console.log(`deleteImage - Extracted filename: ${fileName}`);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error(`deleteImage - Delete error for ${type}:`, error);
      console.error('Delete error details:', {
        message: error.message,
        statusCode: error.statusCode,
      });
      throw new Error(`Failed to delete ${type}: ${error.message}`);
    }
    
    console.log(`deleteImage - Successfully deleted ${type}`);
  } catch (error) {
    console.error(`deleteImage - Error deleting ${type}:`, error);
    // Don't throw error here - we don't want to block movie deletion if image deletion fails
    console.warn(`Continuing without deleting ${type} from storage`);
  }
}

/**
 * Replace an image in Supabase Storage
 * @param oldUrl The old image URL to delete
 * @param newFile The new file to upload
 * @param type The type of image (poster or backdrop)
 * @param movieId The movie ID
 * @returns The public URL of the new image
 */
export async function replaceImage(
  oldUrl: string,
  newFile: File,
  type: ImageType,
  movieId?: string
): Promise<string> {
  // Delete the old image if it exists and is a storage URL
  if (oldUrl && oldUrl.includes('supabase.co/storage')) {
    await deleteImage(oldUrl, type);
  }

  // Upload the new image
  return uploadImage(newFile, type, movieId);
}

/**
 * Check if a URL is a Supabase Storage URL
 * @param url The URL to check
 * @returns True if the URL is a Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes('supabase.co/storage');
}

/**
 * Extract the bucket name from a Supabase Storage URL
 * @param url The URL to extract from
 * @returns The bucket name or null
 */
export function extractBucketFromUrl(url: string): 'posters' | 'backdrops' | null {
  console.log('extractBucketFromUrl - Extracting bucket from URL:', url);
  
  // Supabase storage URL format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/filename
  // Try to extract bucket name from the URL path
  const urlParts = url.split('/');
  const storageIndex = urlParts.indexOf('public');
  
  if (storageIndex !== -1 && storageIndex + 1 < urlParts.length) {
    const bucketName = urlParts[storageIndex + 1];
    console.log('extractBucketFromUrl - Extracted bucket name:', bucketName);
    
    if (bucketName === 'posters') return 'posters';
    if (bucketName === 'backdrops') return 'backdrops';
  }
  
  // Fallback to simple string matching
  if (url.includes('/posters/')) return 'posters';
  if (url.includes('/backdrops/')) return 'backdrops';
  
  console.warn('extractBucketFromUrl - Could not determine bucket from URL');
  return null;
}
