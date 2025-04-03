import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
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
    if (createOrderDto.quantity == 2) {
      throw new HttpException('Quantity is not valid', HttpStatus.BAD_REQUEST);
    }
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async remove(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Order deleted successfully' };
  }
}
