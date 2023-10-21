import { z } from 'zod';

export const SendAnswerSchema = z.object({
  answers: z.array(z.union([z.number(), z.array(z.number()), z.string()])),
  directionId: z.number(),
  testId: z.number(),
}).strict();
