import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import { getDashboard } from "./dashboardControllers.js";
import { userAuthMiddleware } from "@/middlewares/authMiddlewares.js";
import { validateQuerySchema } from "@/utils/validation.js";
import { dashboardValidator } from "./dashboardValidators.js";

export const dashboardRoutes = express.Router();

dashboardRoutes.get(
  "/",
  userAuthMiddleware,
  validateQuerySchema(dashboardValidator),
  asyncHandler(getDashboard)
);
