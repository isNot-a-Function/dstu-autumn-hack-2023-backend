import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z
    .string({
      required_error: 'Почта пользователя обязательна!',
    })
    .email()
    .min(1),
  password: z
    .string({
      required_error: 'Пароль пользователя обязателен!',
    })
    .min(8),
}).strict();

export const SignInSchema = z.object({
  email: z
    .string()
    .email()
    .min(1),
  password: z
    .string({
      required_error: 'Пароль пользователя обязателен!',
    })
    .min(8),
}).strict();
