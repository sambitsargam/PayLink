import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bqqeuqjcuilkawltnxet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcWV1cWpjdWlsa2F3bHRueGV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDA4MjUwOCwiZXhwIjoyMDU5NjU4NTA4fQ.W6vwCh2h4JqGuU-0VGzsV0bYyOLuSkJQFL80bUnf5AU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
