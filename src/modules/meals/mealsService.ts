import { AppError } from "@/services/appError.js";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { SortOrder } from "@/generated/prisma/internal/prismaNamespace.js";
import { prisma } from "@/config/db/prisma.js";

export interface MealsFilters {
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

const sortByFields: Record<string, string> = {
  name: "name",
  type: "type",
};

export const getMealsService = async ({
  sortBy = "",
  sortOrder = "asc",
  search = "",
}: MealsFilters) => {
  const meals = await prisma.meals.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: sortByFields[sortBy]
      ? [{ [sortByFields[sortBy]]: sortOrder }, { id: sortOrder }]
      : undefined,
  });
  return meals;
};

export const getMealBySlugService = async (slug: string) => {
  try {
    const meal = await prisma.meals.findUnique({
      where: {
        slug,
      },
    });
    return meal;
  } catch (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      (error as Error).message ?? ERROR_MESSAGES.FAILED_TO_GET_MEAL,
      ERROR_CODES.FAILED_TO_GET_MEAL
    );
  }
};
