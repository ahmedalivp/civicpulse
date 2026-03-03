import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Ensure the local client gracefully handles development environments where keys might initially be missing
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder_key'
);
