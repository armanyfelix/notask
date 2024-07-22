import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseKey) throw new Error('Api key not found')

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
