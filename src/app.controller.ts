import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateCustomerInterface } from './types/customer.types';
import { CommonResponseInterface } from './types/auth.types';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { DestinationInterface, SortOrderType } from './types/destination.types';
import {
  DestinationCreateDto,
  DestinationUpdateDto,
  QueryParamDestinationDto,
} from './dto/destination.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //TODO: create 2 endpoints for getting all destinations and getting destination by id

  @UseGuards(AuthGuard)
  @Get('destination/:id')
  async getDestination(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<CommonResponseInterface<DestinationInterface[]>> {
    const data = await this.appService.getDestination(customerId);
    return {
      code: HttpStatus.OK,
      message: 'Destinations fetched successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('destinations')
  async getDestinations(
    @Query() query: QueryParamDestinationDto,
  ): Promise<CommonResponseInterface<DestinationInterface[]>> {
    const data = await this.appService.getDestinations(
      query.name,
      query.startDate,
      query.endDate,
      query.sortBy,
      query.sortOrder,
    );
    return {
      code: HttpStatus.OK,
      message: 'Destinations fetched successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/destination/create')
  async createDestination(
    @Body() destination: DestinationCreateDto,
  ): Promise<any> {
    const data = await this.appService.createDestination(destination);
    return {
      code: HttpStatus.CREATED,
      message: 'Destination created successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/destination/delete/:id')
  async deleteDestination(
    @Param('id', ParseIntPipe) destinationId: number,
  ): Promise<any> {
    const data = await this.appService.deleteDestination(destinationId);
    return {
      code: HttpStatus.OK,
      message: 'Destination deleted successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/destination/update/:id')
  async updateDestination(
    @Param('id', ParseIntPipe) destinationId: number,
    @Body() destination: DestinationUpdateDto,
  ): Promise<any> {
    const data = await this.appService.updateDestination(
      destinationId,
      destination,
    );
    return {
      code: HttpStatus.OK,
      message: 'Destination updated successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('customers')
  async getCustomers(): Promise<CommonResponseInterface<any>> {
    const data = await this.appService.getCustomers();
    return {
      code: HttpStatus.OK,
      message: 'Customers fetched successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('customer/:id')
  async getCustomer(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<any> {
    const data = await this.appService.getCustomer(customerId);
    return {
      code: HttpStatus.OK,
      message: 'Customer fetched successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Post('customer/create')
  async createCustomer(
    @Body() customer: CreateCustomerDto,
  ): Promise<CommonResponseInterface<CreateCustomerInterface>> {
    const data = await this.appService.createCustomer(customer);
    return {
      code: HttpStatus.CREATED,
      message: 'Customer created successfully.',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('customer/delete/:id')
  async deleteCustomer(@Param('id') customerId: number): Promise<any> {
    const data = await this.appService.deleteCustomer(customerId);
    return {
      code: HttpStatus.OK,
      message: 'Customer deleted successfully.',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('customer/update/:id')
  async updateCustomer(
    @Param('id', ParseIntPipe) customerId: number,
    @Body() customerData: UpdateCustomerDto,
  ): Promise<any> {
    const data = await this.appService.updateCustomer(customerId, customerData);
    return {
      code: HttpStatus.OK,
      message: 'Customer updated successfully.',
      data,
    };
  }
}
