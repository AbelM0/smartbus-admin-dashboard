import { z } from "zod";

// ─── Shared field definitions ────────────────────────────────────────────────

const phoneField = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^(?:\+251|0)[79]\d{8}$/, "Must be a valid Ethiopian phone number (e.g. +251911234567 or 0911234567)");

const emailField = z
  .string()
  .trim()
  .email("Must be a valid email address");

const optionalEmailField = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().email("Must be a valid email address").optional())
  .optional();

const fullNameField = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be at most 100 characters");

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: phoneField,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Create User ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  fullName: fullNameField,
  phone: phoneField,
  email: optionalEmailField,
  role: z.enum(["PASSENGER", "DRIVER", "ADMIN", "SUPER_ADMIN"], {
    message: "Role is required",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number"),
  fid: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\-]*$/, "FID must be alphanumeric (hyphens allowed)")
    .optional()
    .or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ─── Edit User ───────────────────────────────────────────────────────────────

export const editUserSchema = z.object({
  fullName: fullNameField,
  phone: phoneField,
  email: optionalEmailField,
});

export type EditUserInput = z.infer<typeof editUserSchema>;

// ─── Create Trip ─────────────────────────────────────────────────────────────

export const createTripSchema = z.object({
  routeId: z.string().trim().min(1, "Please select a route"),
  driverId: z.string().trim().min(1, "Please select a driver"),
  busIdentifier: z
    .string()
    .trim()
    .min(2, "Bus identifier must be at least 2 characters")
    .max(20, "Bus identifier must be at most 20 characters")
    .regex(/^[a-zA-Z0-9\-_]+$/, "Bus identifier must be alphanumeric (hyphens/underscores allowed)"),
  scheduledFor: z
    .string()
    .min(1, "Schedule date is required")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      },
      "Scheduled time must be in the future"
    ),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

// ─── Create Route — Step 1 (General Info) ────────────────────────────────────

export const createRouteStep1Schema = z.object({
  routeNumber: z
    .string()
    .trim()
    .min(1, "Route number is required")
    .max(20, "Route number must be at most 20 characters"),
  nameEn: z
    .string()
    .trim()
    .min(2, "English name must be at least 2 characters"),
  nameAm: z
    .string()
    .trim()
    .min(2, "Amharic name must be at least 2 characters"),
  estimatedDuration: z
    .number({ message: "Duration must be a number" })
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
  estimatedDistance: z
    .number({ message: "Distance must be a number" })
    .positive("Distance must be greater than 0"),
  baseFare: z
    .number({ message: "Base fare must be a number" })
    .min(1, "Base fare must be at least 1 ETB"),
});

export type CreateRouteStep1Input = z.infer<typeof createRouteStep1Schema>;

// ─── Create Route — Step 2 (Stops) ───────────────────────────────────────────

export const stopSchema = z.object({
  nameEn: z
    .string()
    .trim()
    .min(2, "Stop name (English) must be at least 2 characters"),
  nameAm: z
    .string()
    .trim()
    .min(2, "Stop name (Amharic) must be at least 2 characters"),
  latitude: z
    .number({ message: "Latitude must be a number" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number({ message: "Longitude must be a number" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export const createRouteStep2Schema = z.object({
  stops: z.array(stopSchema).min(2, "A route must have at least 2 stops"),
});

export type CreateRouteStep2Input = z.infer<typeof createRouteStep2Schema>;

// ─── Create Route — Step 3 (Fares) ───────────────────────────────────────────

export const fareSchema = z.object({
  amount: z
    .number({ message: "Fare amount must be a number" })
    .min(0, "Fare amount cannot be negative"),
});

export const createRouteStep3Schema = z.object({
  fares: z.array(fareSchema),
});

export type CreateRouteStep3Input = z.infer<typeof createRouteStep3Schema>;
