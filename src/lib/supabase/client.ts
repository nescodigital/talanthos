import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { mockSupabaseClient } from './mock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const forceMock = process.env.NEXT_PUBLIC_FORCE_MOCK === 'true';

const isMockMode = forceMock || !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('MOCK') || supabaseAnonKey.includes('MOCK');

export function getSupabaseClient(): SupabaseClient {
  if (isMockMode) {
    console.log('[SUPABASE MOCK] Using mock client');
    return mockSupabaseClient as unknown as SupabaseClient;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getServiceRoleClient(): SupabaseClient {
  if (isMockMode) {
    console.log('[SUPABASE MOCK] Using mock client (service role)');
    return mockSupabaseClient as unknown as SupabaseClient;
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in server environment');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
