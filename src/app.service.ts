import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {
  CreateCustomerInterface,
  UpdateCustomerInterface,
} from './types/customer.types';
import { DestinationInterface } from './types/destination.types';
import {
  DestinationCreateDto,
  DestinationUpdateDto,
} from './dto/destination.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getDestination(customerId: number): Promise<any> {
    try {
      if (!customerId) throw new BadRequestException('User not found');
      const data = await this.prismaService.destinationHistory.findMany({
        where: { customerId: customerId },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getDestinations(
    name?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    SortOrder?: string,
  ): Promise<any> {
    try {
      if (sortBy === '' || !sortBy || sortBy === undefined) {
        sortBy = 'id';
      }
      if (SortOrder === '' || !SortOrder || SortOrder === undefined) {
        SortOrder = 'asc';
      }
      const data = await this.prismaService.destinationHistory.findMany({
        where: {
          destination: {
            contains: name,
          },
          ...(startDate && {
            startDate: {
              gte: new Date(startDate),
            },
          }),
          ...(endDate && {
            endDate: {
              lte: new Date(endDate),
            },
          }),
        },
        orderBy: {
          [sortBy]: SortOrder,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async createDestination(destination: DestinationCreateDto): Promise<any> {
    try {
      if (!destination.customerId)
        throw new BadRequestException('User not found');
      const data = await this.prismaService.destinationHistory.create({
        data: {
          destination: destination.destination,
          startDate: destination.startDate,
          endDate: destination.endDate,
          customerId: destination.customerId,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteDestination(destinationId: number): Promise<any> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: { id: destinationId },
        include: { destinations: true },
      });
      if (!customer) throw new NotFoundException('User not found');

      if (customer.destinations.length <= 1) {
        throw new BadRequestException(
          'User must have at least one destination',
        );
      }

      const data = await this.prismaService.destinationHistory.delete({
        where: { id: destinationId },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async updateDestination(
    destinationId: number,
    destination: DestinationUpdateDto,
  ): Promise<DestinationInterface> {
    try {
      if (!destinationId)
        throw new BadRequestException('Destination not found');
      const data = await this.prismaService.destinationHistory.update({
        where: { id: destinationId },
        data: {
          destination: destination.destination,
          startDate: destination.startDate,
          endDate: destination.endDate,
          updatedAt: new Date(),
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getCustomers(): Promise<any> {
    try {
      const data = await this.prismaService.customer.findMany({
        include: { destinations: true },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getCustomer(customerId: number): Promise<any> {
    try {
      const data = await this.prismaService.customer.findUnique({
        where: { id: customerId },
        include: { destinations: true },
      });
      if (!data) throw new NotFoundException('Customer not found');
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async createCustomer(
    customer: CreateCustomerDto,
  ): Promise<CreateCustomerInterface> {
    try {
      const data = await this.prismaService.customer.create({
        data: {
          name: customer.name,
          email: customer.email,
          destinations: {
            create: customer.destinations.map((d) => ({
              destination: d.destination,
              startDate: new Date(d.startDate),
              endDate: new Date(d.endDate),
            })),
          },
        },
        include: {
          destinations: true,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteCustomer(customerId: number): Promise<any> {
    try {
      if (!customerId) throw new BadRequestException('Customer not found');
      const data = await this.prismaService.customer.delete({
        where: { id: customerId },
      });
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async updateCustomer(
    customerId: number,
    customerData: UpdateCustomerDto,
  ): Promise<void> {
    try {
      if (!customerId) throw new BadRequestException('Customer not found');
      await this.prismaService.customer.update({
        where: {
          id: customerId,
        },
        data: {
          name: customerData.name,
          email: customerData.email,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
