import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://adkehqjmldwojikqxkou.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka2VocWptbGR3b2ppa3F4a291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODMyMTYsImV4cCI6MjA1OTY1OTIxNn0.wH06cGLCaJFF7uz_hPDMD5LM2F0HjHTwe0F2QwVLpTE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
