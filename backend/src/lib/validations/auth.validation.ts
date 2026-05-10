import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(50, "Password must be less than 50 characters long"),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long"),
});