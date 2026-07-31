import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

const formatZodError = (error: ZodError) => {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "body";
    fields[field] = issue.message;
  }

  return {
    message: error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED,
    code: ERROR_CODES.VALIDATION_ERROR,
    fields,
  };
};

export const validateSchema = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: formatZodError(error) });
    }
    next();
  };
};

export const validateQuerySchema = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.query);
    if (error) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: formatZodError(error) });
    }
    next();
  };
};
