import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://famuyknxugflaxplxuhf.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbXV5a254dWdmbGF4cGx4dWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyOTM2MzEsImV4cCI6MjA0MTg2OTYzMX0.EOmvtYjNDaXt398blNy9aZi91bOlcTa8UV2TCuelZ-g'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Hàm kiểm tra kết nối đến Supabase
async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('users').select('*').limit(1)
    if (error) throw error
    console.log("Kết nối Supabase thành công!")
  } catch (error) {
    console.error("Lỗi kết nối đến Supabase:", error.message)
  }
}

// Gọi hàm kiểm tra kết nối khi ứng dụng khởi động
checkSupabaseConnection()

// Lắng nghe thay đổi trạng thái của ứng dụng
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
