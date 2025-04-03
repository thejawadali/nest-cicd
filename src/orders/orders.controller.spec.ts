import { Test, TestingModule } from '@nestjs/testing'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { ValidationError } from "../utils/validation.ext"
import { JoiPipe } from "nestjs-joi"
import { CreateOrderDto } from "./dto/create-order.dto"

describe('OrdersController', () => {
  let joiPipe: JoiPipe;
  const fakeOrders = [{
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 1,
    shippingAddress: '123 Main St, Anytown, USA',
  }]
  let controller: OrdersController
  const mockOrdersService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      }
    }),
    findAll: jest.fn().mockImplementation(() => {
      return fakeOrders
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return fakeOrders.find((order) => order.id === id)
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id,
        ...dto,
      }
    }),
    remove: jest.fn().mockImplementation((id) => {
      return fakeOrders.filter((order) => order.id !== id)
    }),
  }

  const mockValidationError = jest.fn((message: string) => message);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, JoiPipe, {
        provide: ValidationError,
        useValue: mockValidationError,
      }],
    }).overrideProvider(OrdersService).useValue(mockOrdersService).compile()
    controller = module.get<OrdersController>(OrdersController)
    joiPipe = await module.resolve<JoiPipe>(JoiPipe);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // describe('Validation', () => {
  //   it('should pass validation when all fields are valid', async () => {
  //     const dto = new CreateOrderDto();
  //     dto.userId = 1;
  //     dto.productId = 2;
  //     dto.quantity = 10;
  //     dto.shippingAddress = '123 Main St';
  //     dto.totalAmount = 99.99;
  
  //     // Simulating JoiPipe's transform method
  //     const transformSpy = jest.spyOn(joiPipe, 'transform')      .mockResolvedValue(dto as CreateOrderDto);  // Cast to CreateOrderDto
  
  //     const result = await joiPipe.transform(dto, { type: 'body' });
  
  //     // Validate that the transform method was called and the result is the same DTO
  //     expect(transformSpy).toHaveBeenCalledWith(dto, { type: 'body' });
  //     expect(result).toEqual(dto);
  //   });
  // })

  it('should create a new order', () => {
    const createOrderDto = {
      userId: 1,
      productId: 1,
      totalAmount: 100,
      quantity: 1,
      shippingAddress: '123 Main St, Anytown, USA',
    }
    expect(controller.create(createOrderDto)).toEqual({ id: 1, ...createOrderDto })
    expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto)
  })

  it('should get all orders', () => {
    expect(controller.findAll()).toEqual(fakeOrders)
    expect(mockOrdersService.findAll).toHaveBeenCalled()
  })

  it('should get a single order', () => {
    const order = fakeOrders[0]
    expect(controller.findOne(order.id)).toEqual(order)
    expect(mockOrdersService.findOne).toHaveBeenCalledWith(order.id)
  })

  it('should update an order', () => {
    const order = fakeOrders[0]
    const updateOrderDto = {
      userId: 1,
      productId: 1,
      totalAmount: 100,
      quantity: 1,
      shippingAddress: '123 Main St, Anytown, USA',
    }
    expect(controller.update(order.id, updateOrderDto)).toEqual({ id: order.id, ...updateOrderDto })  
    expect(mockOrdersService.update).toHaveBeenCalledWith(order.id, updateOrderDto)
  })

  it('should delete an order', () => {
    const order = fakeOrders[0]
    expect(controller.remove(order.id)).toEqual(fakeOrders.filter((o) => o.id !== order.id))
    expect(mockOrdersService.remove).toHaveBeenCalledWith(order.id)
  })
})