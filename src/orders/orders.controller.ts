import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(
    @Query() orderPaginationDto: OrderPaginationDto
  ) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      );
      return order;
      
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginatioDto: PaginationDto
  ) {

    try {
      return this.client.send('findAllOrders',{
        ...paginatioDto,
        status: statusDto.status
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() statusDto: StatusDto
  ) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusDto.status });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  
}
