import { Request, Response } from "express";
import {
  deleteUserAvatarService,
  getUserByIdService,
  updateUserAvatarService,
  updateUserService,
} from "./userService.js";
import { HTTP_STATUS_CODES } from "@/config/consts.js";

export const getCurrentUser = async (_req: Request, res: Response) => {
  const { userId } = res.locals?.auth;
  const user = await getUserByIdService(userId);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = res.locals?.auth;
  const { name, age, weight, gender, height, activityLevel } = req.body;

  const user = await updateUserService(userId, {
    name,
    age,
    weight,
    gender,
    height,
    activityLevel,
  });
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data: user });
};

export const updateUserAvatar = async (_req: Request, res: Response) => {
  const { userId } = res.locals?.auth;
  const image = res.locals.imageUpload;
  const data = await updateUserAvatarService(userId, image);
  return res.status(HTTP_STATUS_CODES.SUCCESS).json({ data });
};

export const deleteUserAvatar = async (_req: Request, res: Response) => {
  const { userId } = res.locals?.auth;
  await deleteUserAvatarService(userId);
  return res.status(HTTP_STATUS_CODES.NO_CONTENT).json({});
};
