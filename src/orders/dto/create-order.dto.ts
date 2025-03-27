import { PartialType } from "@nestjs/mapped-types"

export class CreateOrderDto {
  userId?: number;
  productId?: number;
  quantity?: number;
  shippingAddress?: string;
  totalAmount?: number;
  orderDate?: Date;
  status?: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
