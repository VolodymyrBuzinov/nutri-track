import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "@/config/consts.js";
import { getMealBySlugService, getMealsService } from "./mealsService.js";
import { SortOrder } from "@/generated/prisma/internal/prismaNamespace.js";

export const getMeals = async (req: Request, res: Response) => {
  const { sortBy, sortOrder, search } = req.query;
  const meals = await getMealsService({
    sortBy: sortBy as string,
    sortOrder: sortOrder as SortOrder,
    search: search as string,
  });
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: meals });
};

export const getMealBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const meal = await getMealBySlugService(slug as unknown as string);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: meal });
};
