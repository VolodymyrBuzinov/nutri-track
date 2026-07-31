import { prisma } from "@/config/db/prisma.js";
import { getMealByIdService } from "../meals/mealsService.js";
import { Meal } from "../meals/mealsTypes.js";
import { AppError } from "@/services/appError.js";
import { ERROR_CODES, HTTP_STATUS_CODES } from "@/config/consts.js";
import { serviceClient } from "@/config/supabase.js";
import type { ValidatedImageUpload } from "@/middlewares/imageUploadMiddleware.js";
import { createImageUrl } from "@/utils/storage.js";

export const createMealAsAdminService = async (meal: Omit<Meal, "id">) => {
  try {
    const newMeal = await prisma.meals.create({
      data: meal,
    });
    return newMeal;
  } catch (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      (error as Error).message ?? "Failed to create meal",
      ERROR_CODES.FAILED_TO_CREATE_MEAL
    );
  }
};

export const updateMealAsAdminService = async (
  mealId: string,
  updatedFields: Partial<Omit<Meal, "id">>
) => {
  const existingMeal = await getMealByIdService(mealId);
  const newMeal = await prisma.meals.update({
    where: {
      id: mealId,
    },
    data: {
      ...updatedFields,
      composition: {
        ...((existingMeal?.composition ?? {}) as Meal["composition"]),
        ...(updatedFields.composition ?? {}),
      },
    },
  });

  return newMeal;
};

export const deleteMealAsAdminService = async (mealId: string) => {
  await getMealByIdService(mealId);
  await prisma.meals.delete({
    where: {
      id: mealId,
    },
  });
};

export const uploadMealImageService = async (
  mealSlug: string,
  image: ValidatedImageUpload
) => {
  const { data: storageData, error } = await serviceClient.storage
    .from("meals_images")
    .upload(`${mealSlug ?? ""}/image`, image.buffer, {
      contentType: image.contentType,
    });

  if (error) {
    if (error.statusCode === "409") {
      throw new AppError(
        HTTP_STATUS_CODES.CONFLICT,
        "A meal with this slug already exists",
        ERROR_CODES.DUPLICATE_SLUG
      );
    }

    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? "Failed to upload the image",
      ERROR_CODES.FAILED_TO_UPLOAD_IMAGE
    );
  }

  return {
    imageUrl: createImageUrl("meals_images", storageData.path),
  };
};

export const deleteMealImageService = async (mealSlug: string) => {
  const { error } = await serviceClient.storage
    .from("meals_images")
    .remove([`${mealSlug ?? ""}/image`]);
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? "Failed to delete the image",
      ERROR_CODES.FAILED_TO_DELETE_IMAGE
    );
  }
};

export const updateMealImageService = async (
  mealSlug: string,
  image: ValidatedImageUpload
) => {
  const { data: storageData, error } = await serviceClient.storage
    .from("meals_images")
    .update(`${mealSlug ?? ""}/image`, image.buffer, {
      contentType: image.contentType,
      upsert: true,
    });
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? "Failed to update the image",
      ERROR_CODES.FAILED_TO_UPDATE_IMAGE
    );
  }

  return {
    imageUrl: createImageUrl("meals_images", storageData.path),
  };
};
