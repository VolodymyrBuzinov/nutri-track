import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { createAuthClient, serviceClient } from "@/config/supabase.js";
import { AppError } from "@/services/appError.js";
import { getUserByIdService } from "../user/userService.js";

export const loginUserService = async (email: string, password: string) => {
  const authClient = createAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new AppError(
      error.status ?? HTTP_STATUS_CODES.UNAUTHORIZED,
      error.message ?? ERROR_MESSAGES.AUTHENTICATION_FAILED,
      error.code ?? ERROR_CODES.AUTHENTICATION_FAILED
    );
  }

  if (data?.user?.role === "admin" && data?.session?.access_token) {
    await serviceClient.auth.admin.signOut(data.session.access_token);
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.USER_NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND
    );
  }

  const profile = await getUserByIdService(data.user.id);

  return {
    user: profile,
    auth: {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresAt: data.session?.expires_at ?? 0,
    },
  };
};

export const logoutUserService = async (accessToken: string) => {
  const { error } = await serviceClient.auth.admin.signOut(accessToken);
  if (error) {
    throw new AppError(
      error.status ?? HTTP_STATUS_CODES.UNAUTHORIZED,
      error.message ?? ERROR_MESSAGES.AUTHENTICATION_FAILED,
      error.code ?? ERROR_CODES.AUTHENTICATION_FAILED
    );
  }
};

export const refreshTokenService = async (refreshToken: string) => {
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
