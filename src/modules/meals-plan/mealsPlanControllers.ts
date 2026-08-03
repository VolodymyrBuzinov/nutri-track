import { HTTP_STATUS_CODES } from "@/config/consts.js";
import { Request, Response } from "express";
import {
  createMealsPlanService,
  resetMealsPlanService,
  getMealsPlanByUserIdAndDateService,
  updateMealsPlanService,
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
  const { userId, meals, date } = req.body;
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

export const resetMealsPlan = async (req: Request, res: Response) => {
  const { planId } = req.params;
  const mealsPlan = await resetMealsPlanService(planId as string);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({
    message: "Meals plan reset successfully",
    data: mealsPlan,
  });
};
