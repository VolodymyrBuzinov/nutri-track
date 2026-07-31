import { NextFunction, Request, Response } from "express";
import { ERROR_CODES, HTTP_STATUS_CODES } from "@/config/consts.js";
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
        message: "Request body is too large",
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
        message: "Something went wrong",
        code: err.code ?? ERROR_CODES.INTERNAL_ERROR,
      },
    });
  }

  req.log.error({ err }, "Unhandled request error");
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: ERROR_CODES.INTERNAL_ERROR,
    },
  });
};
