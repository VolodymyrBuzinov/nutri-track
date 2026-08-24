import z from "zod";
import { MEAL_TYPE_VALUES } from "../meals/mealsTypes.js";
import { mealProductValidator } from "../meals/mealsValidators.js";
import { SORT_ORDER } from "@/config/consts.js";

export const getMealsAsAdminValidator = z.object({
  sortBy: z.enum(["name", "type", "order"]).optional(),
  sortOrder: z.enum(SORT_ORDER).optional(),
  search: z.string().optional(),
});

const mealCompositionValidator = z.object({
  calories: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
  products: z.array(mealProductValidator),
});

export const createMealAsAdminValidator = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(MEAL_TYPE_VALUES),
  order: z.number().int().min(1),
  composition: mealCompositionValidator,
});

export const updateMealAsAdminValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  type: z.enum(MEAL_TYPE_VALUES).optional(),
  order: z.number().int().min(1).optional(),
  composition: mealCompositionValidator.partial().optional(),
});
