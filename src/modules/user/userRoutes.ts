import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import {
  deleteUserAvatar,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from "./userControllers.js";
import { validateSchema } from "@/utils/validation.js";
import { updateUserValidator } from "./userValidators.js";
import { userAuthMiddleware } from "@/middlewares/authMiddlewares.js";
import {
  parseImageUpload,
  validateImageUpload,
} from "@/middlewares/imageUploadMiddleware.js";

export const userRoutes = express.Router();

userRoutes.get("/me", userAuthMiddleware, asyncHandler(getCurrentUser));

userRoutes.patch(
  "/me",
  userAuthMiddleware,
  validateSchema(updateUserValidator),
  asyncHandler(updateUser)
);

userRoutes.patch(
  "/me/image",
  userAuthMiddleware,
  parseImageUpload,
  validateImageUpload,
  asyncHandler(updateUserAvatar)
);

userRoutes.delete(
  "/me/image",
  userAuthMiddleware,
  asyncHandler(deleteUserAvatar)
);
