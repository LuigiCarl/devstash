import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(30).regex(/^[a-z0-9_]+$/),
  password: z.string().min(8).max(72),
});

export const registrationSchema = credentialsSchema.extend({
  name: z.preprocess(
    value => typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().min(1).max(60).optional(),
  ),
});
