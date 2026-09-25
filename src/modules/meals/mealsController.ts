import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "@/config/consts.js";
import {
  getMealBySlugService,
  getMealsService,
  getProductsService,
  getMealsByProductsService,
} from "./mealsService.js";
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

export const getMealsByProducts = async (req: Request, res: Response) => {
  const products = [req.query.products]
    .flat()
    .filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    )
    .map((item) => item.trim());
  const meals = await getMealsByProductsService(products as string[]);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: meals });
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await getProductsService();
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: products });
};

export const getMealBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const meal = await getMealBySlugService(slug as unknown as string);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: meal });
};
