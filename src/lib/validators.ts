import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  fitnessGoal: z.enum(["bulk", "cut", "maintain", "energy"]).optional(),
  dailyCalorieTarget: z.number().int().positive().optional(),
  dailyProteinTarget: z.number().int().positive().optional(),
  dailyCarbTarget: z.number().int().positive().optional(),
  dailyFatTarget: z.number().int().positive().optional(),
});

export const checkoutSchema = z.object({
  orderType: z.enum(["pickup", "delivery", "scheduled"]),
  deliveryAddress: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      zip: z.string().min(5),
    })
    .optional(),
  scheduledAt: z.string().optional(),
  notes: z.string().max(500).optional(),
  promoCode: z.string().optional(),
});

export const cartItemSchema = z.object({
  productType: z.enum(["smoothie", "bowl", "hydration", "snack", "enhancer"]),
  name: z.string(),
  quantity: z.number().int().min(1).max(20),
  unitPrice: z.number().int().min(0),
  details: z.record(z.string(), z.unknown()),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
  }),
});
