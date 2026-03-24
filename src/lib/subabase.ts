import { createClient } from '@supabase/supabase-js';

// These pull the values from your .env.local file automatically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the "brain" of your connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);