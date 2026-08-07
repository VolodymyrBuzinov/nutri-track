import { Meal } from "../meals/mealsTypes.js";

export type DashboardProfileField = "age" | "weight" | "gender" | "height";

export type DashboardProgress = {
  calories: {
    consumed: number;
    remaining: number;
  };
  protein: {
    consumed: number;
    remaining: number;
  };
  carbohydrates: {
    consumed: number;
    remaining: number;
  };
  fat: {
    consumed: number;
    remaining: number;
  };
};

export interface Dashboard {
  status: "ready" | "profile_incomplete";
  missingProfileFields: string[];
  progress: DashboardProgress | null;
  recommendedMeals: Meal[];
}
