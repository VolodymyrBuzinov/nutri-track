import "dotenv/config";

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const env = {
  prismaConnectionUrl: requiredEnv("PRISMA_CONNECTION_URL"),
  supabaseUrl: requiredEnv("SUPABASE_URL"),
  supabaseKey: requiredEnv("SUPABASE_KEY"),
  supabaseServiceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
};
