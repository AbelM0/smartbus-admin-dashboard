import { loginSchema, createUserSchema, createTripSchema } from "./validation";

describe("Validation Schemas", () => {
  describe("Phone Number Validation", () => {
    it("should accept valid Ethiopian phone numbers", () => {
      const validPhones = [
        "+251911234567",
        "0911234567",
        "+251711234567",
        "0711234567",
      ];

      validPhones.forEach((phone) => {
        const result = loginSchema.safeParse({ identifier: phone, password: "password123" });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid phone numbers", () => {
      const invalidPhones = [
        "+1234567890", // Wrong country code
        "0811234567", // Invalid prefix (not 7 or 9)
        "091123456", // Too short
        "09112345678", // Too long
        "invalid", // Not a number
        "", // Empty string
      ];

      invalidPhones.forEach((phone) => {
        const result = loginSchema.safeParse({ identifier: phone, password: "password123" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.flatten().fieldErrors.identifier).toBeDefined();
        }
      });
    });
  });

  describe("Password Validation (Create User)", () => {
    const validBaseUser = {
      fullName: "John Doe",
      phone: "0911234567",
      role: "PASSENGER" as const,
    };

    it("should accept passwords with at least 8 characters and 1 number", () => {
      const result = createUserSchema.safeParse({
        ...validBaseUser,
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject passwords without numbers", () => {
      const result = createUserSchema.safeParse({
        ...validBaseUser,
        password: "passwordword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/contain at least one number/i);
      }
    });

    it("should reject passwords shorter than 8 characters", () => {
      const result = createUserSchema.safeParse({
        ...validBaseUser,
        password: "pass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/at least 8 characters/i);
      }
    });
  });

  describe("Trip Schedule Validation", () => {
    const validBaseTrip = {
      routeId: "route-1",
      driverId: "driver-1",
      busIdentifier: "bus-001",
    };

    it("should accept future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      const result = createTripSchema.safeParse({
        ...validBaseTrip,
        scheduledFor: futureDate.toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it("should reject past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const result = createTripSchema.safeParse({
        ...validBaseTrip,
        scheduledFor: pastDate.toISOString(),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.scheduledFor?.[0]).toMatch(/future/i);
      }
    });

    it("should reject invalid date strings", () => {
      const result = createTripSchema.safeParse({
        ...validBaseTrip,
        scheduledFor: "invalid-date",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.scheduledFor?.[0]).toMatch(/future/i);
      }
    });
  });
});
