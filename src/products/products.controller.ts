import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { NATS_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {

    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'find_one_product' }, { id })
      );
      return product;

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  deleteProduct(
    @Param('id') id: string,
  ) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.client.send({ cmd: 'update_product' }, 
      { id, 
        ...updateProductDto 
      }).pipe(
        catchError( err => { throw new RpcException(err) })
      );
  }
}