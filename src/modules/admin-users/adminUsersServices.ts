import { DATE_FORMAT, ERROR_CODES, HTTP_STATUS_CODES } from "@/config/consts.js";
import { AppError } from "@/services/appError.js";
import { serviceClient } from "@/config/supabase.js";
import { prisma } from "@/config/db/prisma.js";
import { SortOrder } from "@/generated/prisma/internal/prismaNamespace.js";
import { format } from "date-fns";

export interface AdminUsersFilters {
  sortBy?: string;
  sortOrder?: SortOrder;
  email?: string;
}

export const getAdminUsersWithFiltersService = async ({
  sortBy,
  sortOrder = "asc",
  email,
}: AdminUsersFilters) => {
  return prisma.public_users.findMany({
    where: email
      ? {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy:
      sortBy === "name" ? [{ name: sortOrder }, { id: sortOrder }] : undefined,
  });
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
      "User not found",
      ERROR_CODES.USER_NOT_FOUND
    );
  }
  return user;
};

export const createUserAsAdminService = async (
  name: string,
  email: string,
  password: string
) => {
  const { data: authData, error: authError } =
    await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

  if (authError || !authData.user) {
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      authError?.message ?? "Failed to create user",
      authError?.code ?? ERROR_CODES.FAILED_TO_CREATE_USER
    );
  }

  const userId = authData.user.id;
  const createdAt = format(new Date(), DATE_FORMAT);

  try {
    await prisma.profiles.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        name,
        role: "user",
        createdAt,
      },
      update: {
        email,
        name,
        role: "user",
      },
    });

    const user = await prisma.public_users.create({
      data: {
        id: userId,
        name,
        email,
        createdAt,
        age: 0,
        weight: 0,
        gender: "",
        height: 0,
        activityLevel: "",
        avatarUrl: "",
      },
    });

    return user;
  } catch (error) {
    await serviceClient.auth.admin.deleteUser(userId);
    const message =
      error instanceof Error ? error.message : "Failed to create user";
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      message,
      ERROR_CODES.FAILED_TO_CREATE_USER
    );
  }
};

export const deleteUserAsAdminService = async (userId: string) => {
  const { error } = await serviceClient.auth.admin.deleteUser(userId);
  if (error) {
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      error.message ?? "Failed to delete user",
      error.code ?? ERROR_CODES.FAILED_TO_DELETE_USER
    );
  }
};
