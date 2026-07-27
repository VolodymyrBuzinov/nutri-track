export const HTTP_STATUS_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
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
