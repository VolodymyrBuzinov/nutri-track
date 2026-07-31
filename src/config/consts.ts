export const HTTP_STATUS_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

export const DATE_FORMAT = "yyyy-MM-dd";

export const SORT_ORDER = ["asc", "desc"];

export const ROLES = ["user", "admin"] as const;

export type Role = (typeof ROLES)[number];

export const ERROR_CODES = {
  ACCESS_TOKEN_NOT_FOUND: "access_token_not_found",
  INVALID_JWT: "invalid_jwt",
  REFRESH_TOKEN_NOT_FOUND: "refresh_token_not_found",
  AUTHENTICATION_FAILED: "authentication_failed",
  USER_NOT_FOUND: "user_not_found",
  MEALS_PLAN_NOT_FOUND: "meals_plan_not_found",
  DUPLICATE_SLUG: "duplicate_slug",
  IMAGE_REQUIRED: "image_required",
  INVALID_IMAGE_TYPE: "invalid_image_type",
  VALIDATION_ERROR: "validation_error",
  PAYLOAD_TOO_LARGE: "payload_too_large",
  INTERNAL_ERROR: "internal_error",
  FAILED_TO_GET_MEAL: "failed_to_get_meal",
  FAILED_TO_CREATE_MEAL: "failed_to_create_meal",
  FAILED_TO_UPDATE_MEAL: "failed_to_update_meal",
  FAILED_TO_DELETE_MEAL: "failed_to_delete_meal",
  FAILED_TO_UPLOAD_IMAGE: "failed_to_upload_image",
  FAILED_TO_DELETE_IMAGE: "failed_to_delete_image",
  FAILED_TO_UPDATE_IMAGE: "failed_to_update_image",
  FAILED_TO_CREATE_USER: "failed_to_create_user",
  FAILED_TO_UPDATE_USER: "failed_to_update_user",
  FAILED_TO_DELETE_USER: "failed_to_delete_user",
  FAILED_TO_UPLOAD_AVATAR: "failed_to_upload_avatar",
  FAILED_TO_DELETE_AVATAR: "failed_to_delete_avatar",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  AUTHENTICATION_FAILED: "Something went wrong",
  USER_NOT_FOUND: "User not found",
  ADMIN_NOT_FOUND: "The user is not found",
  MEALS_PLAN_NOT_FOUND: "Meals plan not found",
  IMAGE_REQUIRED: "Image is required",
  INVALID_IMAGE_TYPE: "File must be a JPEG, PNG, or WebP image",
  PAYLOAD_TOO_LARGE: "Request body is too large",
  VALIDATION_FAILED: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
  UNEXPECTED_ERROR: "Something went wrong",
  FAILED_TO_GET_MEAL: "Failed to get meal",
  FAILED_TO_CREATE_MEAL: "Failed to create meal",
  FAILED_TO_UPLOAD_IMAGE: "Failed to upload the image",
  FAILED_TO_DELETE_IMAGE: "Failed to delete the image",
  FAILED_TO_UPDATE_IMAGE: "Failed to update the image",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_DELETE_USER: "Failed to delete user",
  FAILED_TO_UPLOAD_AVATAR: "Failed to upload the image",
  FAILED_TO_DELETE_AVATAR: "Failed to delete the image",
  INVALID_DATE_FORMAT: `Invalid date format. Please use the format ${DATE_FORMAT}`,
  MEALS_PLAN_EMPTY: "Meals plan must contain at least one meal",
} as const;
