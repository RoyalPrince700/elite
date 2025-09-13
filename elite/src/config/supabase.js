import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database table names for consistency
export const TABLES = {
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
  ORDERS: 'orders',
  PHOTOS: 'photos'
}

// Storage bucket names
export const BUCKETS = {
  PHOTOS: 'photos',
  PROCESSED_PHOTOS: 'processed-photos'
}

export default supabase
