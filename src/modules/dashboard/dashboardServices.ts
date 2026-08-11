import { calculateUserNormaValues } from "@/utils/index.js";
import { getMealsPlanByUserIdAndDateService } from "../meals-plan/mealsPlanServices.js";
import { getMealsService } from "../meals/mealsService.js";
import { getUserByIdService } from "../user/userService.js";
import { User } from "../user/userTypes.js";
import {
  Dashboard,
  DashboardProfileField,
  DashboardProgress,
} from "./dashboardTypes.js";
import { Meal } from "../meals/mealsTypes.js";
import { PROFILE_FIELDS_DICTIONARY } from "@/config/consts.js";

const PROFILE_FIELDS: DashboardProfileField[] = [
  "age",
  "weight",
  "gender",
  "height",
] as const;

const isProfileFieldFilled = (value: unknown) =>
  typeof value === "number"
    ? Number.isFinite(value) && value > 0
    : typeof value === "string" && value.trim().length > 0;

const getProfileStatus = (
  profile: Record<DashboardProfileField, unknown>
): Pick<Dashboard, "status" | "missingProfileFields"> => {
  const missingProfileFields = PROFILE_FIELDS.filter(
    (field) => !isProfileFieldFilled(profile[field])
  );

  return {
    status: missingProfileFields.length ? "profile_incomplete" : "ready",
    missingProfileFields: missingProfileFields.map(
      (field) => PROFILE_FIELDS_DICTIONARY[field]
    ),
  };
};

const isMealComposition = (
  composition: unknown
): composition is Meal["composition"] => {
  if (
    !composition ||
    typeof composition !== "object" ||
    Array.isArray(composition)
  ) {
    return false;
  }

  const { calories, protein, carbohydrates, fat } = composition as Record<
    string,
    unknown
  >;

  return [calories, protein, carbohydrates, fat].every(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
};

const calculateProgress = (meals: Meal[], user: User): DashboardProgress => {
  const norms = calculateUserNormaValues(user);

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbohydrates = 0;
  let consumedFat = 0;

  for (const meal of meals) {
    const composition = meal?.composition;
    if (!isMealComposition(composition)) continue;

    consumedCalories += composition.calories;
    consumedProtein += composition.protein;
    consumedCarbohydrates += composition.carbohydrates;
    consumedFat += composition.fat;
  }

  return {
    calories: {
      consumed: consumedCalories,
      remaining: norms.bmr - consumedCalories,
    },
    protein: {
      consumed: consumedProtein,
      remaining: norms.protein - consumedProtein,
    },
    carbohydrates: {
      consumed: consumedCarbohydrates,
      remaining: norms.carbohydrates - consumedCarbohydrates,
    },
    fat: {
      consumed: consumedFat,
      remaining: norms.fat - consumedFat,
    },
  };
};

const findRecommendedMeals = async (
  meals: Meal[],
  progress: DashboardProgress
): Promise<Meal[]> => {
  if (progress.calories.remaining <= 0 || !meals.length) {
    return [];
  }

  const allMeals = await getMealsService({});
  const recommendedMeals: Meal[] = [];

  for (const meal of allMeals) {
    const isAlreadyUsed = meals.some(
      (plannedMeal) =>
        plannedMeal.type === meal.type || plannedMeal.id === meal.id
    );

    if (isAlreadyUsed) {
      continue;
    }

    const composition = meal?.composition;
    if (!isMealComposition(composition)) continue;

    const isWithinDailyNorm =
      composition.calories <= progress.calories.remaining &&
      composition.protein <= progress.protein.remaining &&
      composition.carbohydrates <= progress.carbohydrates.remaining &&
      composition.fat <= progress.fat.remaining;

    if (!isWithinDailyNorm) {
      continue;
    }

    recommendedMeals.push(meal as unknown as Meal);
  }

  return recommendedMeals;
};

export const getDashboardService = async (
  userId: string,
  date: string
): Promise<Dashboard> => {
  const user = await getUserByIdService(userId);
  const profileStatus = getProfileStatus({
    age: user.age,
    weight: user.weight,
    gender: user.gender,
    height: user.height,
  });

  const mealsPlan = await getMealsPlanByUserIdAndDateService(userId, date);
  const meals = !mealsPlan ? [] : (mealsPlan.meals as unknown as Meal[]);

  const progress = calculateProgress(meals, user as unknown as User);

  const recommendedMeals = await findRecommendedMeals(meals, progress);

  return { ...profileStatus, progress, recommendedMeals };
};
