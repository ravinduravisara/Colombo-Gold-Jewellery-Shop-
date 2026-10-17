import { z } from "zod";
import { SRI_LANKAN_DISTRICTS } from "./constants";

export const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number")
    .regex(/^[0-9+ -]+$/, "Invalid phone characters"),
  email: z.string().email("Please enter a valid email address"),
  addressLine1: z.string().min(4, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.enum(SRI_LANKAN_DISTRICTS, {
    errorMap: () => ({ message: "Please select a valid Sri Lankan district" }),
  }),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer", "card"]),
  specialInstructions: z.string().max(300).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(9, "Please enter a valid phone number").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const reviewFormSchema = z.object({
  userName: z.string().min(2, "Name is required"),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

