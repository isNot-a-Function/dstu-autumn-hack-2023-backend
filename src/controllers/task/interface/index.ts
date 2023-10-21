import { $Enums } from '@prisma/client';

export interface ICreateTask {
  type: $Enums.TaskType;
  question: string;
  variants?: string[];
  correctAnswer?: number[];
}

export interface IGetTasks {
  type: $Enums.TaskType
}
