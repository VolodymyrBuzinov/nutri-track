import { Gender, User } from "@/modules/user/userTypes.js";
import { CookieOptions, Response } from "express";

type AuthRole = "user" | "admin";

const GENDER_OFFSET: Record<string, number> = {
  чоловік: 5,
  жінка: -161,
};

const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: Gender
) => {
  if (!weight || !height || !age || !gender) return 0;
  const offset = GENDER_OFFSET[gender];
  if (offset === undefined) return 0;
  return Math.round(10 * weight + 6.25 * height - 5 * age + offset);
};

const calculateProtein = (bmr: number) => Math.round((bmr * 0.25) / 4);
const calculateCarbohydrates = (bmr: number) => Math.round((bmr * 0.4) / 4);
const calculateFat = (bmr: number) => Math.round((bmr * 0.3) / 9);

export const calculateUserNormaValues = ({
  weight,
  height,
  age,
  gender,
}: Pick<User, "weight" | "height" | "age" | "gender">) => {
  const bmr = calculateBMR(weight, height, age, gender);
  return {
    bmr,
    protein: calculateProtein(bmr),
    carbohydrates: calculateCarbohydrates(bmr),
    fat: calculateFat(bmr),
  };
};

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    (process.env.COOKIE_SAME_SITE as CookieOptions["sameSite"]) ?? "lax",
  path: "/",
  partitioned: true,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  role: AuthRole
) => {
  res.cookie(`${role}AccessToken`, accessToken, {
    ...authCookieOptions,
    expires: new Date(expiresAt * 1000),
  });

  res.cookie(`${role}RefreshToken`, refreshToken, {
    ...authCookieOptions,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response, role: AuthRole) => {
  res.clearCookie(`${role}AccessToken`, authCookieOptions);
  res.clearCookie(`${role}RefreshToken`, authCookieOptions);
};
