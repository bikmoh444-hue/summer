import type { SupabaseClient } from '@supabase/supabase-js';

export type UploadBucket = 'site-assets' | 'products' | 'packs';

export async function uploadImage(client: SupabaseClient, bucket: UploadBucket, file: File, folder = 'uploads') {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  const path = `${folder}/${Date.now()}-${cleanName}.${ext}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false
  });
  if (error) throw error;
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
