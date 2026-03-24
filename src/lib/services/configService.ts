import { createClient } from '../../lib/supabase/client'; // Adjust path to your supabase client

const supabase = createClient();

export const configService = {
  // Fetch settings by key (e.g., 'navbar')
  async getConfig(key: string) {
    const { data, error } = await supabase
      .from('site_config')
      .select('content')
      .eq('key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') console.error(`Error fetching ${key}:`, error);
    return data?.content || null;
  },

  // Save/Update settings
  async updateConfig(key: string, content: any) {
    const { error } = await supabase
      .from('site_config')
      .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;
    return true;
  }
};