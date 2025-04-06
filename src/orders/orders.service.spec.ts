import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  const mockOrder: Order = {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 3,
    shippingAddress: '123 Main St',
    totalAmount: 100,
  };

  const mockCreateOrderDto: CreateOrderDto = {
    userId: 1,
    productId: 1,
    quantity: 3,
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
            create: jest.fn().mockReturnValue(mockOrder),
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

  it('should add two numbers', () => {
    expect(1 + 2).toBe(31);
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const result = await service.create(mockCreateOrderDto);
      expect(repository.create).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if quantity is not valid', async () => {
      await expect(
        service.create({ ...mockCreateOrderDto, quantity: 2 }),
      ).rejects.toThrow(HttpException);
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

    it('should throw an error if order not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const result = await service.update(1, mockUpdateOrderDto);
      expect(repository.update).toHaveBeenCalledWith(1, mockUpdateOrderDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if order not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.update(999, mockUpdateOrderDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const result = await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Order deleted successfully' });
    });

    it('should throw an error if order not found', async () => {
      (repository.delete as jest.Mock).mockResolvedValueOnce({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(HttpException);
    });
  });
});
