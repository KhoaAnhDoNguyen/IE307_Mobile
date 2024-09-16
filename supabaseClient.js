import { createClient } from '@supabase/supabase-js';

// URL của Supabase project và key public
const supabaseUrl = 'https://famuyknxugflaxplxuhf.supabase.co'; // Thay bằng URL của bạn
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbXV5a254dWdmbGF4cGx4dWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyOTM2MzEsImV4cCI6MjA0MTg2OTYzMX0.EOmvtYjNDaXt398blNy9aZi91bOlcTa8UV2TCuelZ-g'; // Thay bằng public API key của bạn

// Tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
