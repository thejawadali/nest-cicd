import { Injectable } from '@nestjs/common'
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto'
import { Order } from "./entities/order.entity"

@Injectable()
export class OrdersService {
  private orders: Order[] = [{
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 1,
    shippingAddress: "123 Main St",
    totalAmount: 100,
  },
  {
    id: 2,
    userId: 2,
    productId: 2,
    quantity: 2,
    shippingAddress: "456 Main St",
    totalAmount: 200,
  },
  ];

  create(createOrderDto: CreateOrderDto) {
    const order = {
      id: this.orders.length + 1,
      ...createOrderDto,
    }
    this.orders.push(order as Order)
    return order
  }

  findAll() {
    return this.orders
  }

  findOne(id: number) {
    return this.orders.find((order) => order.id === id)
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    const orderIndex = this.orders.findIndex((order) => order.id === id)
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updateOrderDto,
    }
    return this.orders[orderIndex]
  }

  remove(id: number) {
    this.orders = this.orders.filter((order) => order.id !== id)
    return this.orders
  }
}
