import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});