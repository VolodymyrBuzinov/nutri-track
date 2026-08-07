import z from "zod";
import { GENDER_VALUES } from "@/modules/user/userTypes.js";

export const updateUserValidator = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  gender: z.enum(GENDER_VALUES).optional(),
  height: z.number().optional(),
});
