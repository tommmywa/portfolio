import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 20
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Upload a media file (Image or MP4 Video) to Supabase Storage
 * @param {File | Blob} file 
 * @param {string} folder 
 * @returns {Promise<{ url: string | null, error: any }>}
 */
export async function uploadMediaToSupabase(file, folder = 'projects') {
  if (!isSupabaseConfigured() || !supabase) {
    return { url: null, error: new Error('Supabase is not configured') };
  }

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'bin';
    const cleanFileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { url: null, error };
    }

    const { data: publicData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(data.path);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    console.error('Failed to upload media to Supabase:', err);
    return { url: null, error: err };
  }
}
