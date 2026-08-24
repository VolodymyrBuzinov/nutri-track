export type MealType = "сніданок" | "обід" | "вечеря";

export type MealProduct = {
  name: string;
  count: number;
  unit: string;
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  type: MealType;
  order: number;
  composition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    products: MealProduct[];
  };
};

export const MEAL_TYPE_VALUES = ["сніданок", "обід", "вечеря"] as const;
