const { z } = require("zod");

const phoneField = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^(?:\+251|0)[79]\d{8}$/, "Must be a valid Ethiopian phone number (e.g. +251911234567 or 0911234567)");

const loginSchema = z.object({
  identifier: phoneField,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const result = loginSchema.safeParse({ identifier: "", password: "" });
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors;
  console.log("fieldErrors", JSON.stringify(fieldErrors, null, 2));
} else {
  console.log("success");
}
