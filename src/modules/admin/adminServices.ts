import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { AppError } from "@/services/appError.js";
import { prisma } from "@/config/db/prisma.js";

export const getAdminService = async (userId: string) => {
  const admin = await prisma.profiles.findUnique({
    where: {
      id: userId,
    },
  });

  if (!admin || admin.role !== "admin") {
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND
    );
  }

  return admin;
};
