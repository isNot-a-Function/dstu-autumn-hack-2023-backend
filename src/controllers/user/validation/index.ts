import { z } from 'zod';

export const UpdateUserSchema = z.object({
  fullname: z
    .string()
    .optional(),
  logo: z
    .string()
    .optional(),
  phone: z
    .string()
    .optional(),
  tgLink: z
    .string()
    .optional(),
  vkLink: z
    .string()
    .optional(),
}).strict();
