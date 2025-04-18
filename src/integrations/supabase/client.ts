
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ktvjsxucoigarjgqchza.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dmpzeHVjb2lnYXJqZ3FjaHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDQ2MjksImV4cCI6MjA2MDUyMDYyOX0.fPccHgbaKSqdOZZo0uCUqrxOL_U8og14lHm3ETFwW7E";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
