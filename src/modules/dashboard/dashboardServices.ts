import { calculateUserNormaValues } from "@/utils/index.js";
import { getMealsPlanByUserIdAndDateService } from "../meals-plan/mealsPlanServices.js";
import { getMealsService } from "../meals/mealsService.js";
import { getUserByIdService } from "../user/userService.js";
import { ActivityLevel, Gender, User } from "../user/userTypes.js";
import { Dashboard, DashboardProgress } from "./dashboardTypes.js";
import { Meal } from "../meals/mealsTypes.js";

const fallbackNegativeValue = (value: number) => (value < 0 ? 0 : value);

const PROFILE_FIELDS = [
  "age",
  "weight",
  "gender",
  "height",
  "activityLevel",
] as const;

const isProfileComplete = (user: User) =>
  PROFILE_FIELDS.every((field) => user[field] != null);

const calculateProgress = (meals: Meal[], user: User): DashboardProgress => {
  const norms = calculateUserNormaValues(user);

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbohydrates = 0;
  let consumedFat = 0;

  for (const meal of meals) {
    consumedCalories += meal.composition.calories;
    consumedProtein += meal.composition.protein;
    consumedCarbohydrates += meal.composition.carbohydrates;
    consumedFat += meal.composition.fat;
  }

  return {
    calories: {
      consumed: consumedCalories,
      remaining: fallbackNegativeValue(norms.tdee - consumedCalories),
    },
    protein: {
      consumed: consumedProtein,
      remaining: fallbackNegativeValue(norms.protein - consumedProtein),
    },
    carbohydrates: {
      consumed: consumedCarbohydrates,
      remaining: fallbackNegativeValue(
        norms.carbohydrates - consumedCarbohydrates
      ),
    },
    fat: {
      consumed: consumedFat,
      remaining: fallbackNegativeValue(norms.fat - consumedFat),
    },
  };
};

const findRecommendedMeals = async (
  meals: Meal[],
  progress: DashboardProgress
): Promise<Meal[]> => {
  if (progress.calories.remaining <= 0) {
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

    const composition = meal.composition as unknown as Meal["composition"];

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

  if (
    !isProfileComplete({
      ...user,
      gender: user.gender as Gender,
      activityLevel: user.activityLevel as ActivityLevel,
      avatarUrl: user.avatarUrl ?? "",
    })
  ) {
    return { progress: null, recommendedMeals: [] };
  }

  const mealsPlan = await getMealsPlanByUserIdAndDateService(userId, date);

  if (!mealsPlan) {
    return { progress: null, recommendedMeals: [] };
  }

  const progress = calculateProgress(
    mealsPlan.meals as unknown as Meal[],
    user as unknown as User
  );

  const recommendedMeals = await findRecommendedMeals(
    mealsPlan.meals as unknown as Meal[],
    progress
  );

  return { progress, recommendedMeals };
};
