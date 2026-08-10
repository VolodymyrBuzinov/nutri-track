import { HTTP_STATUS_CODES } from "@/config/consts.js";
import { Request, Response } from "express";
import {
  createMealsPlanService,
  resetMealsPlanService,
  getMealsPlanByUserIdAndDateService,
  updateMealsPlanService,
  deleteMealsPlanItemService,
} from "./mealsPlanServices.js";

export const getMealsUserPlan = async (req: Request, res: Response) => {
  const { userId } = res.locals.auth;
  const { date } = req.query;
  const mealsPlan = await getMealsPlanByUserIdAndDateService(
    userId,
    String(date)
  );
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: mealsPlan });
};

export const createMealsPlan = async (req: Request, res: Response) => {
  const { userId } = res.locals.auth;
  const { meals, date } = req.body;
  const mealsPlan = await createMealsPlanService(userId as string, meals, date);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: mealsPlan });
};

export const updateMealsPlan = async (req: Request, res: Response) => {
  const { meals, date } = req.body;
  const { userId } = res.locals.auth;
  const { planId } = req.params;
  const mealsPlan = await updateMealsPlanService(
    planId as string,
    userId as string,
    meals as string[],
    date
  );
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: mealsPlan });
};

export const deleteMealsPlanItem = async (req: Request, res: Response) => {
  const { planId, mealId } = req.params;
  const { userId } = res.locals.auth;
  const mealsPlan = await deleteMealsPlanItemService(
    planId as string,
    mealId as string,
    userId as string
  );
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: mealsPlan });
};

export const resetMealsPlan = async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { userId } = res.locals.auth;
  const mealsPlan = await resetMealsPlanService(
    planId as string,
    userId as string
  );
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({
    data: mealsPlan,
  });
};
