import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dqwqyqvmtkwfxlqspoof.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd3F5cXZtdGt3ZnhscXNwb29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzkyMDcsImV4cCI6MjA1ODI1NTIwN30.YKBanxOAFsNTnZ6HlSVgWWz4zbxPy2mnLZg9VcZnoHM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);