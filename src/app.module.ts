import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';



@Module({
  controllers: [],
  providers: [],
  imports: [ProductsModule, OrdersModule, NatsModule],
})
export class AppModule {}
