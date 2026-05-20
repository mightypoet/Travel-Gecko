import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jctlefprvsmomcuytuau.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_DpPGOjzhBe1fAxZESDDjvg_fFkeZPtw';

export const supabase = createClient(supabaseUrl, supabaseKey);
