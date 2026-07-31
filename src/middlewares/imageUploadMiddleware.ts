import { ERROR_CODES, HTTP_STATUS_CODES } from "@/config/consts.js";
import { AppError } from "@/services/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import { fileTypeFromBuffer } from "file-type";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type ImageMimeType = keyof typeof IMAGE_EXTENSIONS;

export type ValidatedImageUpload = {
  buffer: Buffer;
  contentType: ImageMimeType;
  extension: (typeof IMAGE_EXTENSIONS)[ImageMimeType];
};

export const parseImageUpload = express.raw({
  limit: MAX_IMAGE_SIZE_BYTES,
  type: () => true,
});

export const validateImageUpload = asyncHandler(async (req, res, next) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      "Image is required",
      ERROR_CODES.IMAGE_REQUIRED
    );
  }

  const detectedType = await fileTypeFromBuffer(req.body);
  const contentType = detectedType?.mime as ImageMimeType | undefined;

  if (!contentType || !ALLOWED_IMAGE_MIME_TYPES.includes(contentType)) {
    throw new AppError(
      HTTP_STATUS_CODES.BAD_REQUEST,
      "File must be a JPEG, PNG, or WebP image",
      ERROR_CODES.INVALID_IMAGE_TYPE
    );
  }

  res.locals.imageUpload = {
    buffer: req.body,
    contentType,
    extension: IMAGE_EXTENSIONS[contentType],
  } satisfies ValidatedImageUpload;

  next();
});
