import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {
  CreateCustomerInterface,
  CustomerInterfaceResponse,
  UpdateCustomerInterface,
} from './types/customer.types';
import {
  DestinationInterfaceResponse,
  DestinationInterface,
} from './types/destination.types';
import {
  DestinationCreateDto,
  DestinationUpdateDto,
} from './dto/destination.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getDestinationByCustomerId(
    customerId: number,
    page: number = 1,
    limit: number = 5,
  ): Promise<{
    data: DestinationInterface[];
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const customer = await this.prismaService.customer.findUnique({
        where: { id: customerId },
        include: { destinations: true },
      });
      if (!customer) throw new NotFoundException('Customer not found');
      const [data, count] = await this.prismaService.$transaction([
        this.prismaService.destinationHistory.findMany({
          where: { customerId: customerId },
          skip: skip,
          take: limit,
        }),
        this.prismaService.destinationHistory.count({
          where: { customerId: customerId },
        }),
      ]);
      return {
        data: data,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getDestinationById(
    destinationId: number,
  ): Promise<DestinationInterface> {
    try {
      const data = await this.prismaService.destinationHistory.findUnique({
        where: { id: destinationId },
      });
      if (!data) throw new NotFoundException('Destination not found');
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
    status?: Status,
    sortBy?: string,
    sortOrder?: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<{
    data: DestinationInterface[];
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    try {
      if (sortBy === '' || !sortBy || sortBy === undefined) {
        sortBy = 'id';
      }
      if (sortOrder === '' || !sortOrder || sortOrder === undefined) {
        sortOrder = 'asc';
      }
      const [data, count] = await this.prismaService.$transaction([
        this.prismaService.destinationHistory.findMany({
          where: {
            destination: {
              contains: name,
            },
            ...(status && { status: { equals: status } }),
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
            [sortBy]: sortOrder,
          },
          skip: skip,
          take: limit,
        }),
        this.prismaService.destinationHistory.count({
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
        }),
      ]);
      return {
        data: data,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async createDestination(
    destination: DestinationCreateDto,
  ): Promise<DestinationInterfaceResponse> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: { id: destination.customerId },
        include: { destinations: true },
      });
      if (!customer) throw new NotFoundException('Customer not found');
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

  async deleteDestination(
    destinationId: number,
  ): Promise<DestinationInterfaceResponse> {
    try {
      const customer = await this.prismaService.customer.findMany({
        where: { destinations: { some: { id: destinationId } } },
        include: { destinations: true },
      });
      if (!customer) throw new NotFoundException('User not found');

      if ((customer[0]?.destinations?.length ?? 0) <= 1) {
        throw new BadRequestException(
          'User must have at least one destination',
        );
      }

      const destination =
        await this.prismaService.destinationHistory.findUnique({
          where: { id: destinationId },
        });

      if (!destination) throw new NotFoundException('Destination not found');

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
      const destinationHistory =
        await this.prismaService.destinationHistory.findUnique({
          where: { id: destinationId },
        });
      if (!destinationHistory)
        throw new NotFoundException('Destination not found');
      const data = await this.prismaService.destinationHistory.update({
        where: { id: destinationId },
        data: {
          destination: destination.destination,
          startDate: destination.startDate,
          endDate: destination.endDate,
          status: destination.status,
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

  async getCustomers(
    name?: string,
    email?: string,
    sortBy?: string,
    sortOrder?: string,
    createdFrom?: string,
    createdTo?: string,
    updatedFrom?: string,
    updatedTo?: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<{
    data: CustomerInterfaceResponse[];
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      if (sortBy === '' || !sortBy || sortBy === undefined) {
        sortBy = 'id';
      }
      if (sortOrder === '' || !sortOrder || sortOrder === undefined) {
        sortOrder = 'asc';
      }
      const [data, count] = await this.prismaService.$transaction([
        this.prismaService.customer.findMany({
          where: {
            name: {
              contains: name,
            },
            email: {
              contains: email,
            },
            createdAt: {
              gte: createdFrom,
              lte: createdTo,
            },
            updatedAt: {
              gte: updatedFrom,
              lte: updatedTo,
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: { destinations: true },
          skip: skip,
          take: limit,
        }),
        this.prismaService.customer.count({
          where: {
            name: {
              contains: name,
            },
            email: {
              contains: email,
            },
            createdAt: {
              gte: createdFrom,
              lte: createdTo,
            },
            updatedAt: {
              gte: updatedFrom,
              lte: updatedTo,
            },
          },
        }),
      ]);

      return {
        data: data,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getCustomerById(
    customerId: number,
  ): Promise<CustomerInterfaceResponse> {
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
  ): Promise<CustomerInterfaceResponse> {
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

  async deleteCustomer(
    customerId: number,
  ): Promise<Omit<CustomerInterfaceResponse, 'destinations'>> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: { id: customerId },
        include: { destinations: true || undefined },
      });
      if (!customer) throw new NotFoundException('Customer not found');
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
  ): Promise<Omit<CustomerInterfaceResponse, 'destinations'>> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) throw new NotFoundException('Customer Not Found');
      const data = await this.prismaService.customer.update({
        where: {
          id: customerId,
        },
        data: {
          name: customerData.name,
          email: customerData.email,
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

  async downloadDestinationHistory(
    customerId: number,
  ): Promise<DestinationInterface[]> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: { id: customerId },
        include: { destinations: true },
      });
      if (!customer) throw new NotFoundException('Customer Not Found');
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
}
