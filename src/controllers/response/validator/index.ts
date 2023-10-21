import z from 'zod';

export const GetResponsesSchema = z.object({
  specialization: z
    .string()
    .optional(),
  type: z
    .enum(['internship', 'practice']),
}).strict();

export const VerdictResponseSchema = z.object({
  responseId: z
    .number()
    .min(1),
  verdict: z
    .enum(['accept', 'decline']),
}).strict();

export const UserResponseSchema = z.object({
  directionId: z
    .string()
    .min(1),
}).strict();
