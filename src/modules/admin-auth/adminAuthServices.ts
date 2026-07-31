import { ERROR_CODES, HTTP_STATUS_CODES } from "@/config/consts.js";
import { createAuthClient, serviceClient } from "@/config/supabase.js";
import { AppError } from "@/services/appError.js";
import { getAdminService } from "../admin/adminServices.js";

export const loginAdminService = async (email: string, password: string) => {
  const authClient = createAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      error?.message,
      error?.code ?? ERROR_CODES.AUTHENTICATION_FAILED
    );
  }

  const profile = await getAdminService(data.user?.id);

  if (profile?.role !== "admin") {
    if (data.session?.access_token) {
      await logoutAdminService(data.session.access_token);
    }
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      "User not found",
      ERROR_CODES.USER_NOT_FOUND
    );
  }

  return {
    user: {
      email: profile.email,
      name: profile.name,
      role: profile.role,
    },
    auth: {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresAt: data.session?.expires_at ?? 0,
    },
  };
};

export const logoutAdminService = async (accessToken: string) => {
  const { error } = await serviceClient.auth.admin.signOut(accessToken);
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      error?.message ?? "Something went wrong",
      error?.code ?? ERROR_CODES.AUTHENTICATION_FAILED
    );
  }
};

export const refreshTokenAdminService = async (refreshToken: string) => {
  const authClient = createAuthClient();
  const { data, error } = await authClient.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      error?.message,
      error?.code ?? ERROR_CODES.INVALID_JWT
    );
  }
  return {
    accessToken: data.session?.access_token ?? "",
    refreshToken: data.session?.refresh_token ?? "",
    expiresAt: data.session?.expires_at ?? 0,
  };
};
