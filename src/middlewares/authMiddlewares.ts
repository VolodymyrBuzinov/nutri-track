import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
  Role,
} from "@/config/consts.js";
import { authVerifierClient } from "@/config/supabase.js";
import { AppError } from "@/services/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import { getAdminService } from "@/modules/admin/adminServices.js";

const getToken = (req: Request, role: Role) => {
  const token = req.cookies?.[`${role}AccessToken`];
  const refreshToken = req.cookies?.[`${role}RefreshToken`];
  if (!token && !refreshToken) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED,
      ERROR_CODES.ACCESS_TOKEN_NOT_FOUND
    );
  }
  if (!token && refreshToken) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED,
      ERROR_CODES.INVALID_JWT
    );
  }

  return token;
};

const getUserId = async (token: string) => {
  const { data, error } = await authVerifierClient.auth.getClaims(token);
  const userId = data?.claims?.sub;
  if (error || !userId) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED,
      error?.code ?? ERROR_CODES.INVALID_JWT
    );
  }
  return userId;
};

export const adminAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req, "admin");
    const userId = await getUserId(token);
    await getAdminService(userId);

    res.locals.auth = { userId, role: "admin" };
    next();
  }
);

export const userAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req, "user");
    const userId = await getUserId(token);
    res.locals.auth = { userId, role: "user" };
    next();
  }
);

export const currentUserSessionMiddleware = (role: Role) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[`${role}AccessToken`];
    const refreshToken = req.cookies?.[`${role}RefreshToken`];

    if (!token && !refreshToken) {
      return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: null });
    }

    if (!token && refreshToken) {
      throw new AppError(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
        ERROR_CODES.INVALID_JWT
      );
    }

    const userId = await getUserId(token);
    role === "admin" && (await getAdminService(userId));
    res.locals.auth = { userId, role };
    next();
  });
