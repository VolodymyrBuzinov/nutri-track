import { serviceClient } from "@/config/supabase.js";

export const createImageUrl = (bucket: string, path: string) => {
  const publicUrl = serviceClient.storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;

  return `${publicUrl}?v=${Date.now()}`;
};
