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
};
