import { Injectable } from '@nestjs/common'
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto'
import { Order } from "./entities/order.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    return await this.orderRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.orderRepository.delete(id);
    return { message: 'Order deleted successfully' };
  }
}
