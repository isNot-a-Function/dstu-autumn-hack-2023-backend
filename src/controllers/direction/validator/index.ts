import z from 'zod';

export const GetDirectionsBySpecializationSchema = z.object({
  specialization: z
    .string()
    .optional(),
  type: z
    .enum(['internship', 'practice']),
}).strict();

export const GetOneDirectionSchema = z.object({
  directionId: z
    .string()
    .min(1),
}).strict();
