import { $Enums } from '@prisma/client';

export interface IGetDirectionsBySpecialization {
  specialization?: string;
  type: $Enums.DirectionType
}

export interface IGetOneDirection {
  directionId: string;
}
