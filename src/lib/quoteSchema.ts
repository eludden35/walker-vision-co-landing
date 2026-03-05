import { z } from "zod";

export const QuotePayloadSchema = z.object({
  contact: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number required"),
    address: z.string().max(200).optional(),
    notes: z.string().max(500).optional(),
    honeypot: z.string().max(0).optional(),
  }),
  selections: z.object({
    kitchens: z.array(z.number().int().min(1).max(10000)).default([]),
    bathrooms: z.array(z.number().int().min(1).max(10000)).default([]),
    painting: z.object({
      interiorWalls: z.number().int().min(0).max(100).default(0),
      changingColors: z.boolean().default(false),
      exteriorSqft: z.number().int().min(0).max(50000).default(0),
    }),
  }),
});

export type QuotePayload = z.infer<typeof QuotePayloadSchema>;

export const ContactPayloadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
