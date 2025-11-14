import { createBrowserClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "./public.js";
const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          if (typeof window !== "undefined") {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
          }
        }
      }
    }
  }
);
export {
  supabase as s
};
