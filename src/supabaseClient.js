import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fbtfhaxeabldqklasswv.supabase.co'
// Catatan: Kunci ini ('CnldJl2mPpTFOwyK') yang Anda berikan tampaknya seperti password database.
// Seharusnya Supabase menggunakan 'anon key' (API Key) yang panjang.
// Namun kita gunakan sesuai permintaan Anda untuk inisialisasi awal.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidGZoYXhlYWJsZHFrbGFzc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTQ3OTksImV4cCI6MjA4ODQ3MDc5OX0.EKLig6QCq-F9ywtB0WAnbutz3reasZLYV8Ex0KwSE3E'

export const supabase = createClient(supabaseUrl, supabaseKey)
