import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
} from "./adminAuthControllers.js";
import { validateSchema } from "@/utils/validation.js";
import { loginAuthValidator } from "../auth/authValidators.js";
import {
  adminAuthMiddleware,
  authRateLimitMiddleware,
} from "@/middlewares/authMiddlewares.js";

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post(
  "/login",
  authRateLimitMiddleware,
  validateSchema(loginAuthValidator),
  asyncHandler(loginAdmin)
);

adminAuthRoutes.post("/logout", adminAuthMiddleware, asyncHandler(logoutAdmin));

adminAuthRoutes.post(
  "/refresh-token",
  authRateLimitMiddleware,
  asyncHandler(refreshTokenAdmin)
);
