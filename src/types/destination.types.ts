export interface DestinationInterface {
  destination: string;
  startDate: Date;
  endDate: Date;
  id?: number;
  customerId: number;
  createdAt?: Date;
  updatedAt?: null | Date;
}
export type SortOrderType = 'asc' | 'desc';
