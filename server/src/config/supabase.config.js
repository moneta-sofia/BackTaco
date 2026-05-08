import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'





dotenv.config();
export const supabase = 
createClient(
    process.env.SUPEBASE_STORAGE_ENDPOINT,
    process.env.SUPEBASE_STORAGE_SECRET_SERVICE_ROLE)

export const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKETNAME;
