import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  );
}

const REMEMBER_ME_KEY = 'cafe-journal-remember-me';

/**
 * Custom storage adapter: when "remember me" is on, the session is written
 * to localStorage and survives closing the browser. When it's off, the
 * session lives in sessionStorage only and disappears once the tab closes.
 * The flag itself is read fresh on every write, so toggling it takes effect
 * on the next sign-in without needing to recreate the client.
 */
const rememberAwareStorage = {
  getItem: (key: string) => {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    const remember = window.localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    if (remember) {
      window.localStorage.setItem(key, value);
    } else {
      window.sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: rememberAwareStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

/** Call before signing in to set whether this session should persist across browser restarts. */
export function setRememberMe(remember: boolean) {
  window.localStorage.setItem(REMEMBER_ME_KEY, String(remember));
}
