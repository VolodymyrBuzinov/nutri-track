const schemaRef = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

const responseRef = (name: string) => ({
  $ref: `#/components/responses/${name}`,
});

const jsonBody = (schema: Record<string, unknown>, required = true) => ({
  required,
  content: {
    "application/json": { schema },
  },
});

const jsonResponse = (
  description: string,
  schema?: Record<string, unknown>
) => ({
  description,
  ...(schema
    ? {
        content: {
          "application/json": { schema },
        },
      }
    : {}),
});

const dataResponse = (description: string, schema: Record<string, unknown>) =>
  jsonResponse(description, {
    type: "object",
    required: ["data"],
    properties: { data: schema },
  });

const pathParameter = (name: string, description: string) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string" },
});

const dateQueryParameter = {
  name: "date",
  in: "query",
  required: true,
  description: "Calendar date in yyyy-MM-dd format.",
  schema: { type: "string", format: "date", example: "2026-07-17" },
};

const accessTokenSecurity = [{ userAccessToken: [] }];
const adminAccessTokenSecurity = [{ adminAccessToken: [] }];
const userRefreshTokenSecurity = [{ userRefreshToken: [] }];
const adminRefreshTokenSecurity = [{ adminRefreshToken: [] }];

const authCookieHeaders = (
  role: "user" | "admin",
  action: "set" | "clear"
) => ({
  "Set-Cookie": {
    description:
      action === "set"
        ? `Sets the HttpOnly ${role}AccessToken and ${role}RefreshToken cookies.`
        : `Clears the ${role}AccessToken and ${role}RefreshToken cookies.`,
    schema: { type: "string" },
  },
});

const standardProtectedErrors = {
  "400": responseRef("ValidationError"),
  "401": responseRef("UnauthorizedError"),
  "403": responseRef("ForbiddenError"),
  "500": responseRef("InternalServerError"),
};

const standardAdminErrors = {
  ...standardProtectedErrors,
  "404": responseRef("NotFoundError"),
};

const binaryImageBody = {
  required: true,
  content: {
    "image/jpeg": { schema: { type: "string", format: "binary" } },
    "image/png": { schema: { type: "string", format: "binary" } },
    "image/webp": { schema: { type: "string", format: "binary" } },
  },
};

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Node JS Learn API",
    version: "1.0.0",
    description:
      "API for user profiles, meals, meal plans, dashboards, and administration. Supabase tokens are managed exclusively through role-specific HttpOnly cookies and are never returned in response bodies.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "User authentication" },
    { name: "Users" },
    { name: "Meals" },
    { name: "Meal plans" },
    { name: "Dashboard" },
    { name: "Admin authentication" },
    { name: "Admin profile" },
    { name: "Admin users" },
    { name: "Admin meals" },
  ],
  paths: {
    "/users/auth/login": {
      post: {
        operationId: "userLogin",
        tags: ["User authentication"],
        summary: "Log in a user",
        requestBody: jsonBody(schemaRef("LoginRequest")),
        responses: {
          "200": {
            ...dataResponse("Login successful.", schemaRef("User")),
            headers: authCookieHeaders("user", "set"),
          },
          "400": responseRef("ValidationError"),
          "401": responseRef("UnauthorizedError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/users/auth/logout": {
      post: {
        operationId: "userLogout",
        tags: ["User authentication"],
        summary: "Log out a user",
        security: accessTokenSecurity,
        responses: {
          "204": {
            description: "Logout successful.",
            headers: authCookieHeaders("user", "clear"),
          },
          "401": responseRef("UnauthorizedError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/users/auth/refresh-token": {
      post: {
        operationId: "userRefreshSession",
        tags: ["User authentication"],
        summary: "Refresh a user session",
        security: userRefreshTokenSecurity,
        responses: {
          "200": {
            description: "Session refreshed and authentication cookies rotated.",
            headers: authCookieHeaders("user", "set"),
          },
          "401": responseRef("UnauthorizedError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/users/me": {
      get: {
        operationId: "getCurrentUser",
        tags: ["Users"],
        summary: "Get the authenticated user's profile",
        security: accessTokenSecurity,
        responses: {
          "200": dataResponse("User profile.", schemaRef("User")),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
      patch: {
        operationId: "updateUser",
        tags: ["Users"],
        summary: "Update the authenticated user's profile",
        security: accessTokenSecurity,
        requestBody: jsonBody(schemaRef("UpdateUserRequest")),
        responses: {
          "200": jsonResponse("User profile updated.", {
            type: "object",
            required: ["message", "data"],
            properties: {
              message: { type: "string" },
              data: schemaRef("User"),
            },
          }),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/users/me/image": {
      patch: {
        operationId: "uploadUserAvatar",
        tags: ["Users"],
        summary: "Upload or replace the user's avatar",
        description:
          "Send the image as the raw request body. JPEG, PNG, and WebP files up to 5 MB are accepted.",
        security: accessTokenSecurity,
        requestBody: binaryImageBody,
        responses: {
          "200": dataResponse("Avatar uploaded.", {
            type: "object",
            required: ["avatarUrl"],
            properties: {
              avatarUrl: { type: "string", format: "uri" },
            },
          }),
          ...standardProtectedErrors,
          "413": responseRef("PayloadTooLargeError"),
        },
      },
      delete: {
        operationId: "deleteUserAvatar",
        tags: ["Users"],
        summary: "Delete the user's avatar",
        security: accessTokenSecurity,
        responses: {
          "204": { description: "Avatar deleted." },
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/meals": {
      get: {
        operationId: "getMeals",
        tags: ["Meals"],
        summary: "List meals",
        parameters: [
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": dataResponse("Meal list.", {
            type: "array",
            items: schemaRef("Meal"),
          }),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/meals/{id}": {
      get: {
        operationId: "getMeal",
        tags: ["Meals"],
        summary: "Get a meal",
        parameters: [pathParameter("id", "Meal identifier.")],
        responses: {
          "200": dataResponse("Meal or null when it does not exist.", {
            nullable: true,
            allOf: [schemaRef("Meal")],
          }),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/meals-plan/{userId}": {
      get: {
        operationId: "getMealPlan",
        tags: ["Meal plans"],
        summary: "Get a user's meal plan for a date",
        security: accessTokenSecurity,
        parameters: [
          pathParameter("userId", "User identifier."),
          { ...dateQueryParameter, required: false },
        ],
        responses: {
          "200": dataResponse("Meal plan.", schemaRef("MealPlan")),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/meals-plan": {
      post: {
        operationId: "createMealPlan",
        tags: ["Meal plans"],
        summary: "Create a meal plan",
        security: accessTokenSecurity,
        requestBody: jsonBody(schemaRef("MealPlanRequest")),
        responses: {
          "200": dataResponse("Meal plan created.", schemaRef("MealPlan")),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/meals-plan/{planId}": {
      put: {
        operationId: "updateMealPlan",
        tags: ["Meal plans"],
        summary: "Replace a meal plan",
        security: accessTokenSecurity,
        parameters: [pathParameter("planId", "Meal plan identifier.")],
        requestBody: jsonBody(schemaRef("MealPlanRequest")),
        responses: {
          "200": dataResponse("Meal plan updated.", schemaRef("MealPlan")),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/meals-plan/{planId}/reset": {
      patch: {
        operationId: "resetMealPlan",
        tags: ["Meal plans"],
        summary: "Remove all meals from a meal plan",
        security: accessTokenSecurity,
        parameters: [pathParameter("planId", "Meal plan identifier.")],
        responses: {
          "200": jsonResponse("Meal plan reset.", {
            type: "object",
            required: ["message", "data"],
            properties: {
              message: { type: "string" },
              data: schemaRef("MealPlan"),
            },
          }),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/dashboard/{userId}": {
      get: {
        operationId: "getDashboard",
        tags: ["Dashboard"],
        summary: "Get dashboard data for a date",
        security: accessTokenSecurity,
        parameters: [
          pathParameter("userId", "User identifier."),
          dateQueryParameter,
        ],
        responses: {
          "200": dataResponse("Dashboard data.", schemaRef("Dashboard")),
          ...standardProtectedErrors,
          "404": responseRef("NotFoundError"),
        },
      },
    },
    "/admin/auth/login": {
      post: {
        operationId: "adminLogin",
        tags: ["Admin authentication"],
        summary: "Log in an administrator",
        requestBody: jsonBody(schemaRef("LoginRequest")),
        responses: {
          "200": {
            ...dataResponse(
              "Admin login successful.",
              schemaRef("AdminLoginUser")
            ),
            headers: authCookieHeaders("admin", "set"),
          },
          "400": responseRef("ValidationError"),
          "401": responseRef("UnauthorizedError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/admin/auth/logout": {
      post: {
        operationId: "adminLogout",
        tags: ["Admin authentication"],
        summary: "Log out an administrator",
        security: adminAccessTokenSecurity,
        responses: {
          "204": {
            description: "Logout successful.",
            headers: authCookieHeaders("admin", "clear"),
          },
          "401": responseRef("UnauthorizedError"),
          "403": responseRef("ForbiddenError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/admin/auth/refresh-token": {
      post: {
        operationId: "adminRefreshSession",
        tags: ["Admin authentication"],
        summary: "Refresh an administrator session",
        security: adminRefreshTokenSecurity,
        responses: {
          "200": {
            description: "Session refreshed and authentication cookies rotated.",
            headers: authCookieHeaders("admin", "set"),
          },
          "401": responseRef("UnauthorizedError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/admin/me": {
      get: {
        operationId: "adminGetProfile",
        tags: ["Admin profile"],
        summary: "Get the authenticated administrator",
        security: adminAccessTokenSecurity,
        responses: {
          "200": dataResponse("Administrator profile.", schemaRef("Admin")),
          "400": responseRef("ValidationError"),
          "401": responseRef("UnauthorizedError"),
          "403": responseRef("ForbiddenError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/admin/users": {
      get: {
        operationId: "adminGetUsers",
        tags: ["Admin users"],
        summary: "List users",
        security: adminAccessTokenSecurity,
        parameters: [
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string", enum: ["name"] },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
          {
            name: "email",
            in: "query",
            schema: { type: "string", format: "email" },
          },
        ],
        responses: {
          "200": dataResponse("User list.", {
            type: "array",
            items: schemaRef("User"),
          }),
          ...standardAdminErrors,
        },
      },
      post: {
        operationId: "adminCreateUser",
        tags: ["Admin users"],
        summary: "Create a user",
        security: adminAccessTokenSecurity,
        requestBody: jsonBody(schemaRef("CreateUserRequest")),
        responses: {
          "201": dataResponse("User created.", schemaRef("User")),
          ...standardAdminErrors,
        },
      },
    },
    "/admin/users/{userId}": {
      parameters: [pathParameter("userId", "User identifier.")],
      get: {
        operationId: "adminGetUser",
        tags: ["Admin users"],
        summary: "Get a user",
        security: adminAccessTokenSecurity,
        responses: {
          "200": dataResponse("User.", schemaRef("User")),
          ...standardAdminErrors,
        },
      },
      delete: {
        operationId: "adminDeleteUser",
        tags: ["Admin users"],
        summary: "Delete a user",
        security: adminAccessTokenSecurity,
        responses: {
          "204": { description: "User deleted." },
          ...standardAdminErrors,
        },
      },
    },
    "/admin/meals": {
      get: {
        operationId: "adminGetMeals",
        tags: ["Admin meals"],
        summary: "List meals for administration",
        security: adminAccessTokenSecurity,
        parameters: [
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string", enum: ["name", "type"] },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": dataResponse("Meal list.", {
            type: "object",
            required: ["meals"],
            properties: {
              meals: { type: "array", items: schemaRef("Meal") },
            },
          }),
          ...standardAdminErrors,
        },
      },
      post: {
        operationId: "adminCreateMeal",
        tags: ["Admin meals"],
        summary: "Create a meal",
        security: adminAccessTokenSecurity,
        requestBody: jsonBody(schemaRef("CreateMealRequest")),
        responses: {
          "201": dataResponse("Meal created.", {
            type: "object",
            required: ["meal"],
            properties: { meal: schemaRef("Meal") },
          }),
          ...standardAdminErrors,
        },
      },
    },
    "/admin/meals/{mealId}": {
      parameters: [pathParameter("mealId", "Meal identifier.")],
      get: {
        operationId: "adminGetMeal",
        tags: ["Admin meals"],
        summary: "Get a meal for administration",
        security: adminAccessTokenSecurity,
        responses: {
          "200": dataResponse("Meal.", {
            type: "object",
            required: ["meal"],
            properties: { meal: schemaRef("Meal") },
          }),
          ...standardAdminErrors,
        },
      },
      patch: {
        operationId: "adminUpdateMeal",
        tags: ["Admin meals"],
        summary: "Update a meal",
        security: adminAccessTokenSecurity,
        requestBody: jsonBody(schemaRef("UpdateMealRequest")),
        responses: {
          "200": dataResponse("Meal updated.", {
            type: "object",
            required: ["meal"],
            properties: { meal: schemaRef("Meal") },
          }),
          ...standardAdminErrors,
        },
      },
      delete: {
        operationId: "adminDeleteMeal",
        tags: ["Admin meals"],
        summary: "Delete a meal",
        description:
          "Warning: the current implementation does not apply administrator authentication to this route.",
        responses: {
          "204": { description: "Meal deleted." },
          "404": responseRef("NotFoundError"),
          "500": responseRef("InternalServerError"),
        },
      },
    },
    "/admin/meals/{mealSlug}/image": {
      parameters: [pathParameter("mealSlug", "Meal slug.")],
      post: {
        operationId: "adminUploadMealImage",
        tags: ["Admin meals"],
        summary: "Upload a meal image",
        description:
          "Send the image as the raw request body. JPEG, PNG, and WebP files up to 5 MB are accepted.",
        security: adminAccessTokenSecurity,
        requestBody: binaryImageBody,
        responses: {
          "200": dataResponse("Image uploaded.", {
            type: "object",
            required: ["imageUrl"],
            properties: {
              imageUrl: { type: "string", format: "uri" },
            },
          }),
          ...standardAdminErrors,
          "413": responseRef("PayloadTooLargeError"),
        },
      },
      patch: {
        operationId: "adminUpdateMealImage",
        tags: ["Admin meals"],
        summary: "Replace a meal image",
        description:
          "Send the image as the raw request body. JPEG, PNG, and WebP files up to 5 MB are accepted.",
        security: adminAccessTokenSecurity,
        requestBody: binaryImageBody,
        responses: {
          "200": dataResponse("Image replaced.", {
            type: "object",
            required: ["imageUrl"],
            properties: {
              imageUrl: { type: "string", format: "uri" },
            },
          }),
          ...standardAdminErrors,
          "413": responseRef("PayloadTooLargeError"),
        },
      },
      delete: {
        operationId: "adminDeleteMealImage",
        tags: ["Admin meals"],
        summary: "Delete a meal image",
        security: adminAccessTokenSecurity,
        responses: {
          "204": { description: "Image deleted." },
          ...standardAdminErrors,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      userAccessToken: {
        type: "apiKey",
        in: "cookie",
        name: "userAccessToken",
        description: "HttpOnly Supabase access token for a user session.",
      },
      userRefreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "userRefreshToken",
        description: "HttpOnly Supabase refresh token for a user session.",
      },
      adminAccessToken: {
        type: "apiKey",
        in: "cookie",
        name: "adminAccessToken",
        description: "HttpOnly Supabase access token for an administrator session.",
      },
      adminRefreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "adminRefreshToken",
        description:
          "HttpOnly Supabase refresh token for an administrator session.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["message", "code"],
            properties: {
              message: { type: "string" },
              code: { type: "string" },
              fields: {
                type: "object",
                additionalProperties: { type: "string" },
              },
            },
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: {
            type: "string",
            format: "password",
            minLength: 8,
            maxLength: 20,
            pattern:
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()[\\]{}<>\\\\|;:'\\\",.?/~`_+=-]).{8,}$",
          },
        },
      },
      User: {
        type: "object",
        required: [
          "id",
          "name",
          "email",
          "createdAt",
          "age",
          "weight",
          "gender",
          "height",
          "activityLevel",
          "avatarUrl",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          age: { type: "number" },
          weight: { type: "number" },
          gender: { type: "string", enum: ["чоловік", "жінка", ""] },
          height: { type: "number" },
          activityLevel: {
            type: "string",
            enum: ["малий", "середній", "високий", ""],
          },
          avatarUrl: { type: "string" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          weight: { type: "number" },
          gender: { type: "string", enum: ["чоловік", "жінка", ""] },
          height: { type: "number" },
          activityLevel: {
            type: "string",
            enum: ["малий", "середній", "високий", ""],
          },
        },
      },
      MealProduct: {
        type: "object",
        required: ["name", "count", "unit"],
        properties: {
          name: { type: "string" },
          count: { type: "number" },
          unit: { type: "string" },
        },
      },
      MealComposition: {
        type: "object",
        required: [
          "calories",
          "protein",
          "carbohydrates",
          "fat",
          "products",
        ],
        properties: {
          calories: { type: "number" },
          protein: { type: "number" },
          carbohydrates: { type: "number" },
          fat: { type: "number" },
          products: {
            type: "array",
            items: schemaRef("MealProduct"),
          },
        },
      },
      Meal: {
        type: "object",
        required: [
          "id",
          "name",
          "description",
          "imageUrl",
          "slug",
          "type",
          "composition",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          slug: { type: "string" },
          type: {
            type: "string",
            enum: ["сніданок", "обід", "вечеря"],
          },
          composition: schemaRef("MealComposition"),
        },
      },
      CreateMealRequest: {
        type: "object",
        required: [
          "name",
          "description",
          "imageUrl",
          "slug",
          "type",
          "composition",
        ],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
          imageUrl: { type: "string", minLength: 1 },
          slug: { type: "string", minLength: 1 },
          type: {
            type: "string",
            enum: ["сніданок", "обід", "вечеря"],
          },
          composition: schemaRef("MealComposition"),
        },
      },
      UpdateMealRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          type: {
            type: "string",
            enum: ["сніданок", "обід", "вечеря"],
          },
          composition: {
            type: "object",
            properties: {
              calories: { type: "number" },
              protein: { type: "number" },
              carbohydrates: { type: "number" },
              fat: { type: "number" },
              products: {
                type: "array",
                items: schemaRef("MealProduct"),
              },
            },
          },
        },
      },
      MealPlanRequest: {
        type: "object",
        required: ["userId", "date", "meals"],
        properties: {
          userId: { type: "string", format: "uuid" },
          date: {
            type: "string",
            format: "date",
            example: "2026-07-17",
          },
          meals: {
            type: "array",
            minItems: 1,
            items: { type: "string", format: "uuid" },
          },
        },
      },
      MealPlan: {
        type: "object",
        required: ["id", "userId", "date", "meals"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          date: { type: "string", format: "date" },
          meals: {
            type: "array",
            items: schemaRef("Meal"),
          },
        },
      },
      DashboardProgress: {
        type: "object",
        required: ["calories", "protein", "carbohydrates", "fat"],
        properties: {
          calories: schemaRef("NutrientProgress"),
          protein: schemaRef("NutrientProgress"),
          carbohydrates: schemaRef("NutrientProgress"),
          fat: schemaRef("NutrientProgress"),
        },
      },
      NutrientProgress: {
        type: "object",
        required: ["consumed", "remaining"],
        properties: {
          consumed: { type: "number" },
          remaining: { type: "number" },
        },
      },
      Dashboard: {
        type: "object",
        required: ["progress", "recommendedMeals"],
        properties: {
          progress: {
            nullable: true,
            allOf: [schemaRef("DashboardProgress")],
          },
          recommendedMeals: {
            type: "array",
            items: schemaRef("Meal"),
          },
        },
      },
      Admin: {
        type: "object",
        required: ["id", "email", "name", "createdAt", "role"],
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          role: { type: "string" },
        },
      },
      AdminLoginUser: {
        type: "object",
        required: ["email", "name", "role"],
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string" },
          role: { type: "string", enum: ["admin"] },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
    },
    responses: {
      ValidationError: jsonResponse(
        "The request failed validation.",
        schemaRef("Error")
      ),
      UnauthorizedError: jsonResponse(
        "Authentication is required or failed.",
        schemaRef("Error")
      ),
      ForbiddenError: jsonResponse(
        "The authenticated principal cannot access this resource.",
        schemaRef("Error")
      ),
      NotFoundError: jsonResponse(
        "The requested resource was not found.",
        schemaRef("Error")
      ),
      PayloadTooLargeError: jsonResponse(
        "The request body exceeds the 5 MB upload limit.",
        schemaRef("Error")
      ),
      InternalServerError: jsonResponse(
        "An unexpected server error occurred.",
        schemaRef("Error")
      ),
    },
  },
} as const;
