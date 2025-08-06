import { Status } from '@prisma/client';

export interface DestinationInterface {
  destination: string;
  startDate: Date;
  endDate: Date;
  status: Status;
  id?: number;
  customerId: number;
  createdAt?: Date;
  updatedAt?: null | Date;
}
export interface DestinationInterfaceResponse {
  id: number;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: Status;
  customerId: number;
  createdAt: Date;
  updatedAt: null | Date;
}

export type SortOrderType = 'asc' | 'desc';
