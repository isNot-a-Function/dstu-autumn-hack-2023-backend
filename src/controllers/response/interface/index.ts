import { $Enums } from '@prisma/client';

export interface IGetResponses {
  type: $Enums.DirectionType;
  specialization?: string;
}

export interface IVerdictResponse {
  responseId: number;
  verdict: 'accept' | 'decline'
}

export interface IUserResponse {
  directionId: string;
}

export interface IGetUserResponses {
  userId: string
}
