import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  const mockOrder: Order = {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    shippingAddress: '123 Main St',
    totalAmount: 100,
  };

  const mockCreateOrderDto: CreateOrderDto = {
    userId: 1,
    productId: 1,
    quantity: 2,
    shippingAddress: '123 Main St',
    totalAmount: 100,
  };

  const mockUpdateOrderDto: UpdateOrderDto = {
    quantity: 3,
    totalAmount: 150,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn().mockResolvedValue(mockOrder),
            save: jest.fn().mockResolvedValue(mockOrder),
            find: jest.fn().mockResolvedValue([mockOrder]),
            findOne: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const result = await service.create(mockCreateOrderDto);
      expect(repository.create).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const result = await service.findOne(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const result = await service.update(1, mockUpdateOrderDto);
      expect(repository.update).toHaveBeenCalledWith(1, mockUpdateOrderDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const result = await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Order deleted successfully' });
    });
  });
});