import { prisma } from "@/config/db/prisma.js";

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
  await prisma.meals_plans.update({
    where: {
      id: planId,
    },
    data: {
      meals_plan_items: {
        create: mealsIds.map((mealId) => ({
          meal_id: mealId,
        })),
      },
    },
  });

  return getMealsPlanByUserIdAndDateService(userId, date);
};

export const resetMealsPlanService = async (id: string) => {
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
