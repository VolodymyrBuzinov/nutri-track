import { AppError } from "@/services/appError.js";
import {
  DATE_FORMAT,
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { User } from "@/modules/user/userTypes.js";
import { prisma } from "@/config/db/prisma.js";
import { format } from "date-fns";
import { ValidatedImageUpload } from "@/middlewares/imageUploadMiddleware.js";
import { serviceClient } from "@/config/supabase.js";
import { getImageUrl } from "@/utils/storage.js";

const avatarsBucket = "users_avatars";

const getAvatarPath = (userId: string) => `${userId}/avatar`;

export const getUsersData = async () => {
  const users = await prisma.public_users.findMany();
  return users;
};

export const getUserByIdService = async (userId: string) => {
  const user = await prisma.public_users.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError(
      HTTP_STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND
    );
  }
  return user;
};

export const updateUserService = async (
  userId: string,
  data: Partial<User>
) => {
  await getUserByIdService(userId);
  const updatedUser = await prisma.public_users.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
      updatedAt: format(new Date(), DATE_FORMAT),
    },
  });

  if (data.name) {
    await prisma.profiles.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
      },
    });
  }

  return updatedUser;
};

export const updateUserAvatarService = async (
  userId: string,
  image: ValidatedImageUpload
) => {
  await getUserByIdService(userId);
  const { data: storageData, error } = await serviceClient.storage
    .from(avatarsBucket)
    .upload(getAvatarPath(userId), image.buffer, {
      contentType: image.contentType,
      upsert: true,
    });
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? ERROR_MESSAGES.FAILED_TO_UPLOAD_AVATAR,
      ERROR_CODES.FAILED_TO_UPLOAD_AVATAR
    );
  }

  const avatarUrl = getImageUrl(avatarsBucket, storageData.path);

  await updateUserService(userId, { avatarUrl });

  return { avatarUrl };
};

export const deleteUserAvatarService = async (userId: string) => {
  await getUserByIdService(userId);
  const { error } = await serviceClient.storage
    .from(avatarsBucket)
    .remove([getAvatarPath(userId)]);
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message ?? ERROR_MESSAGES.FAILED_TO_DELETE_AVATAR,
      ERROR_CODES.FAILED_TO_DELETE_AVATAR
    );
  }

  await updateUserService(userId, { avatarUrl: "" });
};
