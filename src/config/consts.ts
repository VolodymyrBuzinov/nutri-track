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

export const PROFILE_FIELDS_DICTIONARY = {
  age: "Вік",
  weight: "Вага",
  gender: "Стать",
  height: "Зріст",
  activityLevel: "Рівень активності",
} as const;

export const ERROR_CODES = {
  ACCESS_TOKEN_NOT_FOUND: "access_token_not_found",
  INVALID_JWT: "invalid_jwt",
  REFRESH_TOKEN_NOT_FOUND: "refresh_token_not_found",
  AUTHENTICATION_FAILED: "authentication_failed",
  USER_NOT_FOUND: "user_not_found",
  MEALS_PLAN_NOT_FOUND: "meals_plan_not_found",
  FAILED_TO_DELETE_MEAL_FROM_PLAN: "failed_to_delete_meal_from_plan",
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
  UNAUTHORIZED: "Неавторизований доступ",
  AUTHENTICATION_FAILED: "Помилка автентифікації",
  USER_NOT_FOUND: "Користувача не знайдено",
  ADMIN_NOT_FOUND: "Адміністратора не знайдено",
  MEALS_PLAN_NOT_FOUND: "План харчування не знайдено",
  FAILED_TO_DELETE_MEAL_FROM_PLAN: "Не вдалося видалити страву з плану",
  IMAGE_REQUIRED: "Необхідно завантажити зображення",
  INVALID_IMAGE_TYPE: "Файл має бути зображенням у форматі JPEG, PNG або WebP",
  PAYLOAD_TOO_LARGE: "Розмір тіла запиту завеликий",
  VALIDATION_FAILED: "Помилка валідації",
  INTERNAL_ERROR: "Внутрішня помилка сервера",
  UNEXPECTED_ERROR: "Сталася неочікувана помилка",
  FAILED_TO_GET_MEAL: "Не вдалося отримати страву",
  FAILED_TO_CREATE_MEAL: "Не вдалося створити страву",
  FAILED_TO_UPLOAD_IMAGE: "Не вдалося завантажити зображення",
  FAILED_TO_DELETE_IMAGE: "Не вдалося видалити зображення",
  FAILED_TO_UPDATE_IMAGE: "Не вдалося оновити зображення",
  FAILED_TO_CREATE_USER: "Не вдалося створити користувача",
  FAILED_TO_DELETE_USER: "Не вдалося видалити користувача",
  FAILED_TO_UPLOAD_AVATAR: "Не вдалося завантажити аватар",
  FAILED_TO_DELETE_AVATAR: "Не вдалося видалити аватар",
  INVALID_DATE_FORMAT: `Неправильний формат дати. Використовуйте формат ${DATE_FORMAT}`,
} as const;
