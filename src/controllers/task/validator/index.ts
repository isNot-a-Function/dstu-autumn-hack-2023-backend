import { z } from 'zod';

export const CreateTaskSchema = z.object({
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
}).strict();
