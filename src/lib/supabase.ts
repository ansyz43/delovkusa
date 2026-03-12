import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Создаём клиент только если URL задан, иначе — заглушка
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase URL or Anon Key not set. Auth features will be disabled. " +
    "Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
  // Создаём заглушку с минимальной реализацией, чтобы приложение не падало
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (_event: any, _callback: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signUp: () => Promise.resolve({ data: {}, error: { message: "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env файл." } }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: { message: "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env файл." } }),
      signInWithOtp: () => Promise.resolve({ data: {}, error: { message: "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env файл." } }),
      verifyOtp: () => Promise.resolve({ data: {}, error: { message: "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env файл." } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as unknown as SupabaseClient;
}

export { supabase };
