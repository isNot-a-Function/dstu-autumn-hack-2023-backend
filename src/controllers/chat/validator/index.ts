import z from 'zod';

export const SendMessageSchema = z.object({
  groupId: z
    .number()
    .min(1),
  text: z
    .string(),
}).strict();
export const GetMessagesInGroupSchema = z.object({
  groupId: z
    .string(),
}).strict();

export const StartChatingSchema = z.object({
  userId: z
    .number(),
}).strict();
