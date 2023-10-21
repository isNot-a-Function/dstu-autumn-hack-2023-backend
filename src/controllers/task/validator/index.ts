import { z } from 'zod';

export const CreateTaskSchema = z.object({
  correctAnswer: z
    .array(
      z.number(),
    ),
  question: z
    .string()
    .min(1),
  type: z
    .enum([
      'singleResponse',
      'multipleResponse',
      'detailedResponse',
      'codeResponse',
    ]),
  variants: z
    .array(
      z.string(),
    ),
}).strict();

export const GetTasksSchema = z.object({
  type: z
    .enum([
      'singleResponse',
      'multipleResponse',
      'detailedResponse',
      'codeResponse',
    ]),
}).strict();
