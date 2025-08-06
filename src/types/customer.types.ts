import { DestinationInterface } from './destination.types';

export interface CreateCustomerInterface {
  id?: number;
  name: string;
  email: string;
  destinations: DestinationInterface[];
  createdAt?: Date;
  updatedAt?: null | Date;
}

export interface UpdateCustomerInterface {
  name?: string;
  email?: string;
  destinations?: DestinationInterface[];
}

export interface CustomerInterfaceResponse {
  id: number;
  name: string;
  email: string;
  destinations: DestinationInterface[];
  createdAt: Date;
  updatedAt: null | Date;
}
