import { HTTP_STATUS_CODES } from "@/config/consts.js";
import { ActivityLevel, Gender, User } from "@/modules/user/userTypes.js";
import { AppError } from "@/services/appError.js";
import { CookieOptions, Response } from "express";

type AuthRole = "user" | "admin";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  малий: 1.2,
  середній: 1.55,
  високий: 1.725,
};

const GENDER_BASE: Record<string, (base: number) => number> = {
  чоловік: (base: number) => base + 5,
  жінка: (base: number) => base - 161,
};

const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: Gender
) => {
  if (!weight || !height || !age || !gender) return 0;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return GENDER_BASE[gender](base);
};

const calculateTDEE = (bmr: number, activityLevel: ActivityLevel) => {
  if (!activityLevel) return 0;
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
};

const calculateProtein = (tdee: number) => Math.round(tdee * 0.25);
const calculateCarbohydrates = (tdee: number) => Math.round(tdee * 0.4);
const calculateFat = (tdee: number) => Math.round(tdee * 0.3);

export const calculateUserNormaValues = ({
  weight,
  height,
  age,
  gender,
  activityLevel,
}: User) => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const protein = calculateProtein(tdee);
  const carbohydrates = calculateCarbohydrates(tdee);
  const fat = calculateFat(tdee);
  return { bmr, tdee, protein, carbohydrates, fat };
};

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    (process.env.COOKIE_SAME_SITE as CookieOptions["sameSite"]) ?? "lax",
  path: "/",
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
