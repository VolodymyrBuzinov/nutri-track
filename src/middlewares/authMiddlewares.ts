import { HTTP_STATUS_CODES, Role } from "@/config/consts.js";
import { authVerifierClient } from "@/config/supabase.js";
import { AppError } from "@/services/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import { getAdminService } from "@/modules/admin/adminServices.js";

const getToken = (req: Request, role: Role) => {
  const token = req.cookies?.[`${role}AccessToken`];
  if (!token) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      "Unauthorized",
      `${role}_access_token_not_found`
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
      "Unauthorized",
      error?.code
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

    if (!token) {
      return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: null });
    }
    const userId = await getUserId(token);
    role === "admin" && (await getAdminService(userId));
    res.locals.auth = { userId, role };
    next();
  });
