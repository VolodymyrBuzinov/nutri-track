import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import {
  createMealAsAdmin,
  deleteMealAsAdmin,
  deleteMealImage,
  getMealBySlugAsAdmin,
  getMealsAsAdmin,
  updateMealAsAdmin,
  updateMealImage,
  uploadMealImage,
} from "./adminMealsControllers.js";
import {
  createMealAsAdminValidator,
  getMealsAsAdminValidator,
  updateMealAsAdminValidator,
} from "./adminMealsValidators.js";
import { validateQuerySchema, validateSchema } from "@/utils/validation.js";
import { adminAuthMiddleware } from "@/middlewares/authMiddlewares.js";
import {
  parseImageUpload,
  validateImageUpload,
} from "@/middlewares/imageUploadMiddleware.js";

export const adminMealsRoutes = express.Router();

adminMealsRoutes.get(
  "/",
  adminAuthMiddleware,
  validateQuerySchema(getMealsAsAdminValidator),
  asyncHandler(getMealsAsAdmin)
);

adminMealsRoutes.get(
  "/:mealSlug",
  adminAuthMiddleware,
  asyncHandler(getMealBySlugAsAdmin)
);
adminMealsRoutes.post(
  "/",
  adminAuthMiddleware,
  validateSchema(createMealAsAdminValidator),
  asyncHandler(createMealAsAdmin)
);

adminMealsRoutes.patch(
  "/:mealSlug",
  adminAuthMiddleware,
  validateSchema(updateMealAsAdminValidator),
  asyncHandler(updateMealAsAdmin)
);

adminMealsRoutes.delete(
  "/:mealSlug",
  adminAuthMiddleware,
  asyncHandler(deleteMealAsAdmin)
);

adminMealsRoutes.post(
  "/:mealSlug/image",
  adminAuthMiddleware,
  parseImageUpload,
  validateImageUpload,
  asyncHandler(uploadMealImage)
);

adminMealsRoutes.delete(
  "/:mealSlug/image",
  adminAuthMiddleware,
  asyncHandler(deleteMealImage)
);

adminMealsRoutes.patch(
  "/:mealSlug/image",
  adminAuthMiddleware,
  parseImageUpload,
  validateImageUpload,
  asyncHandler(updateMealImage)
);
