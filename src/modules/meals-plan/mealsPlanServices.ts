import { prisma } from "@/config/db/prisma.js";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { AppError } from "@/services/appError.js";

const getOwnedMealsPlan = async (planId: string, userId: string) => {
  const plan = await prisma.meals_plans.findFirst({
    where: {
      id: planId,
      user_id: userId,
    },
  });

  if (!plan) {
    throw new AppError(
      HTTP_STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.MEALS_PLAN_NOT_FOUND,
      ERROR_CODES.MEALS_PLAN_NOT_FOUND
    );
  }

  return plan;
};

export const getMealsPlanByUserIdAndDateService = async (
  userId: string,
  date: string
) => {
  const plan = await prisma.meals_plans.findFirst({
    where: {
      user_id: userId,
      date,
    },
  });

  if (!plan) return null;

  const planMeals = await prisma.meals_plan_items.findMany({
    where: {
      meals_plan_id: plan.id,
    },
    include: {
      meals: true,
    },
  });

  return {
    id: plan.id,
    userId,
    date,
    meals: planMeals.map((item) => item.meals),
  };
};

export const createMealsPlanService = async (
  userId: string,
  mealsIds: string[],
  date: string
) => {
  await prisma.meals_plans.create({
    data: {
      user_id: userId,
      date,
      meals_plan_items: {
        create: mealsIds.map((mealId) => ({
          meal_id: mealId,
        })),
      },
    },
  });

  return getMealsPlanByUserIdAndDateService(userId, date);
};

export const updateMealsPlanService = async (
  planId: string,
  userId: string,
  mealsIds: string[],
  date: string
) => {
  await getOwnedMealsPlan(planId, userId);

  const meals = await prisma.meals.findMany({
    where: {
      id: {
        in: mealsIds,
      },
    },
    select: {
      id: true,
      type: true,
    },
  });

  const mealTypes = meals.map((meal) => meal.type);

  await prisma.$transaction([
    prisma.meals_plan_items.deleteMany({
      where: {
        meals_plan_id: planId,
        meals: {
          type: {
            in: mealTypes,
          },
        },
      },
    }),
    prisma.meals_plan_items.createMany({
      data: meals.map((meal) => ({
        meals_plan_id: planId,
        meal_id: meal.id,
      })),
    }),
  ]);

  return getMealsPlanByUserIdAndDateService(userId, date);
};

export const deleteMealsPlanItemService = async (
  planId: string,
  mealId: string,
  userId: string
) => {
  const plan = await getOwnedMealsPlan(planId, userId);

  const planItem = await prisma.meals_plan_items.findFirst({
    where: {
      meal_id: mealId,
      meals_plan_id: planId,
    },
  });

  if (!planItem) {
    throw new AppError(
      HTTP_STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.FAILED_TO_DELETE_MEAL_FROM_PLAN,
      ERROR_CODES.FAILED_TO_DELETE_MEAL_FROM_PLAN
    );
  }

  await prisma.meals_plan_items.delete({
    where: {
      id: planItem.id,
    },
  });

  return getMealsPlanByUserIdAndDateService(userId, plan.date);
};

export const resetMealsPlanService = async (id: string, userId: string) => {
  await getOwnedMealsPlan(id, userId);

  const plan = await prisma.meals_plans.update({
    where: {
      id,
    },
    data: {
      meals_plan_items: {
        deleteMany: {},
      },
    },
  });

  return {
    id: plan.id,
    userId: plan.user_id,
    date: plan.date,
    meals: [],
  };
};
