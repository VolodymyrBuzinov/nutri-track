import { HTTP_STATUS_CODES } from "@/config/consts.js";
import { serviceClient } from "@/config/supabase.js";
import { AppError } from "@/services/appError.js";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export const createImageSignedUrl = async (bucket: string, path: string) => {
  const { data, error } = await serviceClient.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? "Failed to create image URL"
    );
  }

  return data.signedUrl;
};
