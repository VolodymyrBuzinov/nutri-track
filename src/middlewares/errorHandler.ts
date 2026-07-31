import { NextFunction, Request, Response } from "express";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
} from "@/config/consts.js";
import { AppError } from "../services/appError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestError = err as Error & { status?: number; type?: string };

  if (
    requestError.status === HTTP_STATUS_CODES.PAYLOAD_TOO_LARGE ||
    requestError.type === "entity.too.large"
  ) {
    return res.status(HTTP_STATUS_CODES.PAYLOAD_TOO_LARGE).json({
      error: {
        message: ERROR_MESSAGES.PAYLOAD_TOO_LARGE,
        code: ERROR_CODES.PAYLOAD_TOO_LARGE,
      },
    });
  }

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  if (err instanceof AppError) {
    req.log.error({ err }, "Non-operational application error");
    return res.status(err.status).json({
      error: {
        message: ERROR_MESSAGES.UNEXPECTED_ERROR,
        code: err.code ?? ERROR_CODES.INTERNAL_ERROR,
      },
    });
  }

  req.log.error({ err }, "Unhandled request error");
  return res.status(500).json({
    error: {
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      code: ERROR_CODES.INTERNAL_ERROR,
    },
  });
};
