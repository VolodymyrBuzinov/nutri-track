import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { pinoHttp } from "pino-http";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./config/logger.js";
import { userRoutes } from "@/modules/user/userRoutes.js";
import { mealsRoutes } from "@/modules/meals/mealsRoutes.js";
import { mealsPlanRoutes } from "@/modules/meals-plan/mealsPlanRoutes.js";
import { dashboardRoutes } from "@/modules/dashboard/dashboardRoutes.js";
import { adminRoutes } from "./modules/admin/adminRoutes.js";
import { adminUsersRoutes } from "./modules/admin-users/adminUsersRoutes.js";
import { adminMealsRoutes } from "./modules/admin-meals/adminMealsRoutes.js";
import { adminAuthRoutes } from "./modules/admin-auth/adminAuthRoutes.js";
import { userAuthRoutes } from "./modules/auth/authRoutes.js";
import { openApiDocument } from "./openapi/openApiDocument.js";
import { corsOptions } from "./config/cors.js";

const app = express();

app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res, error) => {
      if (error || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/api-docs.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/users", userRoutes);
app.use("/users/auth", userAuthRoutes);
app.use("/users/meals", mealsRoutes);
app.use("/users/meals-plan", mealsPlanRoutes);
app.use("/users/dashboard", dashboardRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/users", adminUsersRoutes);
app.use("/admin/meals", adminMealsRoutes);
app.use(errorHandler);

export default app;
