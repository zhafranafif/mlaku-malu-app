import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CustomerInterfaceResponse } from './types/customer.types';
import { CommonResponseInterface } from './types/auth.types';
import {
  CreateCustomerDto,
  QueryParamCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import {
  DestinationInterfaceResponse,
  DestinationInterface,
} from './types/destination.types';
import {
  DestinationCreateDto,
  DestinationUpdateDto,
  QueryParamDestinationDto,
} from './dto/destination.dto';
import { Response } from 'express';
import PDFDocument from 'pdfkit';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get('destination/:destinationId')
  async getDestinationById(
    @Param('destinationId', ParseIntPipe) destinationId: number,
  ): Promise<CommonResponseInterface<DestinationInterface>> {
    const data = await this.appService.getDestinationById(destinationId);
    return {
      code: HttpStatus.OK,
      message: `Destination ${destinationId} fetched successfully.`,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('destinations')
  async getDestinations(@Query() query: QueryParamDestinationDto): Promise<
    CommonResponseInterface<{
      data: DestinationInterface[];
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const data = await this.appService.getDestinations(
      query.name,
      query.startDate,
      query.endDate,
      query.status,
      query.sortBy,
      query.sortOrder,
      Number(query.page),
      Number(query.limit),
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
  ): Promise<CommonResponseInterface<DestinationInterfaceResponse>> {
    const data = await this.appService.createDestination(destination);
    return {
      code: HttpStatus.CREATED,
      message: 'Destination created successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/destination/delete/:destinationId')
  async deleteDestination(
    @Param('destinationId', ParseIntPipe) destinationId: number,
  ): Promise<CommonResponseInterface<Pick<DestinationInterface, 'id'>>> {
    const data = await this.appService.deleteDestination(destinationId);
    return {
      code: HttpStatus.OK,
      message: `Destination ${destinationId} deleted successfully`,
      data: { id: data.id },
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/destination/update/:destinationId')
  async updateDestination(
    @Param('destinationId', ParseIntPipe) destinationId: number,
    @Body() destination: DestinationUpdateDto,
  ): Promise<CommonResponseInterface<Pick<DestinationInterface, 'id'>>> {
    const data = await this.appService.updateDestination(
      destinationId,
      destination,
    );
    return {
      code: HttpStatus.OK,
      message: `Destination ${destinationId} updated successfully`,
      data: { id: data.id },
    };
  }

  @UseGuards(AuthGuard)
  @Get('customers')
  async getCustomers(@Query() query: QueryParamCustomerDto): Promise<
    CommonResponseInterface<{
      data: CustomerInterfaceResponse[];
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const data = await this.appService.getCustomers(
      query.name,
      query.email,
      query.sortBy,
      query.sortOrder,
      query.createdFrom,
      query.createdTo,
      query.updatedFrom,
      query.updatedTo,
      Number(query.page),
      Number(query.limit),
    );
    return {
      code: HttpStatus.OK,
      message: 'Customers fetched successfully.',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('customer/:customerId')
  async getCustomerById(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CommonResponseInterface<CustomerInterfaceResponse>> {
    const data = await this.appService.getCustomerById(customerId);
    return {
      code: HttpStatus.OK,
      message: `Customer ${customerId} fetched successfully.`,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/customer/:customerId/destinations')
  async getDestinationByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query() query: QueryParamDestinationDto,
  ): Promise<
    CommonResponseInterface<{
      data: DestinationInterface[];
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const data = await this.appService.getDestinationByCustomerId(
      customerId,
      query.page,
      query.limit,
    );
    return {
      code: HttpStatus.OK,
      message: `Destinations for customer ${customerId} fetched successfully.`,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Post('customer/create')
  async createCustomer(
    @Body() customer: CreateCustomerDto,
  ): Promise<CommonResponseInterface<CustomerInterfaceResponse>> {
    const data = await this.appService.createCustomer(customer);
    return {
      code: HttpStatus.CREATED,
      message: 'Customer created successfully.',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('customer/delete/:customerId')
  async deleteCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CommonResponseInterface<Pick<CustomerInterfaceResponse, 'id'>>> {
    const data = await this.appService.deleteCustomer(customerId);
    return {
      code: HttpStatus.OK,
      message: `Customer ${customerId} deleted successfully`,
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('customer/update/:customerId')
  async updateCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() customerData: UpdateCustomerDto,
  ): Promise<CommonResponseInterface<Pick<CustomerInterfaceResponse, 'id'>>> {
    const data = await this.appService.updateCustomer(customerId, customerData);
    return {
      code: HttpStatus.OK,
      message: `Customer ${customerId} updated successfully.`,
      data: { id: data.id },
    };
  }

  @UseGuards(AuthGuard)
  @Get('/customer/:customerId/download-destinations-history')
  async downloadDestinationHistory(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.appService.downloadDestinationHistory(customerId);

    const customer = await this.appService.getCustomerById(customerId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="destination-history.pdf"',
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text(`Destination History`, {
      align: 'center',
    });
    doc.moveDown();
    doc.fontSize(14).text(`Customer: ${customer.name}`);
    doc.fontSize(14).text(`Email: ${customer.email}`);
    doc.moveDown();

    data.forEach((d: DestinationInterface, i: number) => {
      doc
        .fontSize(12)
        .text(`${i + 1}. Destination: ${d.destination}`)
        .text(
          `    Start   : ${new Intl.DateTimeFormat('en-US', {
            weekday: 'long', // Sunday
            year: 'numeric', // 2025
            month: 'long', // August
            day: '2-digit', // 10
            hour: '2-digit', // 16
            minute: '2-digit', // 00
            timeZone: 'Asia/Jakarta',
            hour12: false,
          }).format(d.startDate)}`,
        )
        .text(
          `    End    : ${new Intl.DateTimeFormat('en-US', {
            weekday: 'long', // Sunday
            year: 'numeric', // 2025
            month: 'long', // August
            day: '2-digit', // 10
            hour: '2-digit', // 16
            minute: '2-digit', // 00
            timeZone: 'Asia/Jakarta',
            hour12: false,
          }).format(d.endDate)}`,
        )
        .text(`    Status  : ${d.status}`)
        .moveDown();
    });

    doc.end();
  }
}
