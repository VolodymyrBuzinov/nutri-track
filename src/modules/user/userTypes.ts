export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
  age: number;
  weight: number;
  gender: Gender;
  height: number;
  avatarUrl: string;
};

export type Gender = (typeof GENDER_VALUES)[number];

export const GENDER_VALUES = ["чоловік", "жінка", ""] as const;
