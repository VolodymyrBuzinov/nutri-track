import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import {
  createMealsPlan,
  resetMealsPlan,
  getMealsUserPlan,
  updateMealsPlan,
  deleteMealsPlanItem,
} from "./mealsPlanControllers.js";
import { validateSchema } from "@/utils/validation.js";
import { mealsPlanValidator } from "./mealsPlanValidators.js";
import { userAuthMiddleware } from "@/middlewares/authMiddlewares.js";

export const mealsPlanRoutes = express.Router();

mealsPlanRoutes.get("/", userAuthMiddleware, asyncHandler(getMealsUserPlan));
mealsPlanRoutes.post(
  "/",
  userAuthMiddleware,
  validateSchema(mealsPlanValidator),
  asyncHandler(createMealsPlan)
);
mealsPlanRoutes.put(
  "/:planId",
  userAuthMiddleware,
  validateSchema(mealsPlanValidator),
  asyncHandler(updateMealsPlan)
);

mealsPlanRoutes.patch(
  "/:planId/reset",
  userAuthMiddleware,
  asyncHandler(resetMealsPlan)
);

mealsPlanRoutes.delete(
  "/:planId/items/:planItemId",
  userAuthMiddleware,
  asyncHandler(deleteMealsPlanItem)
);
