import { userAuthMiddleware } from "@/middlewares/authMiddlewares.js";
import { getMealBySlug, getMeals } from "./mealsController.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";

export const mealsRoutes = express.Router();

mealsRoutes.get("/", userAuthMiddleware, asyncHandler(getMeals));
mealsRoutes.get("/:slug", userAuthMiddleware, asyncHandler(getMealBySlug));
