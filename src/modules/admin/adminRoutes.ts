import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import { getAdmin } from "./adminControllers.js";
import { adminAuthMiddleware } from "@/middlewares/authMiddlewares.js";

export const adminRoutes = express.Router();

adminRoutes.get("/me", adminAuthMiddleware, asyncHandler(getAdmin));
