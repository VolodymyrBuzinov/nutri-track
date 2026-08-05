import { parse, isValid } from "date-fns";
import z from "zod";
import { DATE_FORMAT, ERROR_MESSAGES } from "@/config/consts.js";

export const mealsPlanValidator = z.object({
  date: z.string().refine(
    (date) => {
      const parsed = parse(date, DATE_FORMAT, new Date());
      return isValid(parsed);
    },
    {
      message: ERROR_MESSAGES.INVALID_DATE_FORMAT,
    }
  ),
  meals: z.array(z.string()),
});
