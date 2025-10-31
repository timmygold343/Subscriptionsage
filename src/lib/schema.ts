import { z } from "zod";

// Types for frontend use (inferred from backend API responses)
export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  subscriptionStatus: string | null;
  subscriptionProvider: string | null;
  subscriptionPlan: string | null;
  paystackCustomerCode: string | null;
  paystackReference: string | null;
  createdAt: Date | string;
};

export type Template = {
  id: number;
  title: string;
  category: string;
  description: string;
  codeHTML: string;
  codeCSS: string;
  codeJS: string;
  previewImage: string | null;
  tags: string[] | null;
  createdBy: number | null;
  createdAt: Date | string;
};

// Validation schemas (matching backend)
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  codeHTML: z.string().min(1, "HTML code is required"),
  codeCSS: z.string().default(""),
  codeJS: z.string().default(""),
  previewImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.number().optional(),
});

// Categories constant
export const CATEGORIES = [
  "Cards",
  "Buttons",
  "Forms",
  "Navigation",
  "Modals",
  "Inputs",
  "Loaders",
  "Animations",
] as const;

export type Category = typeof CATEGORIES[number];

