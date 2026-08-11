import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const createAuthClient = () =>
  createClient(env.supabaseUrl, env.supabaseKey, clientOptions);

export const authVerifierClient = createAuthClient();

export const serviceClient = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  clientOptions
);
