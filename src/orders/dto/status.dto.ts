import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class StatusDto {

    @IsOptional()
    @IsEnum( OrderStatusList, {
        message: `Posibles valores ${ OrderStatusList}`
    })
    status: OrderStatus;
}