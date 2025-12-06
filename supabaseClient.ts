
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dyhrtztirgshtwzuxjoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5aHJ0enRpcmdzaHR3enV4am9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjI2NzQsImV4cCI6MjA4MDU5ODY3NH0.B1lvCfKB_zeCvWLiYYxvXiVLS0ZK3gPL0kiEQBy9jNo'

export const supabase = createClient(supabaseUrl, supabaseKey)
