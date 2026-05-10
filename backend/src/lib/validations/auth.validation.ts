import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required", ).max(100, "Name must be less than 100 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters long"),
});