import z from 'zod';

export const CreateTestSchema = z.object({
  tasks: z
    .array(
      z.number(),
    ),
  title: z
    .string()
    .min(1),
}).strict();

export const GetTestSchema = z.object({
  testId: z
    .string()
    .min(1),
}).strict();
