import { Test } from "@nestjs/testing"
import { TestingModule } from "@nestjs/testing"
import { OrdersService } from "./orders.service"
import { OrdersController } from "./orders.controller"
import { CreateOrderDto } from "./dto/create-order.dto"
describe('OrdersService', () => {
  let service: OrdersService
  const mockOrdersService = {
    create: jest.fn().mockImplementation((createOrderDto: CreateOrderDto) => {
      return {
        id: 1,
        ...createOrderDto,
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).overrideProvider(OrdersService).useValue(mockOrdersService).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  
  it('should create a new order', () => {
    const createOrderDto = {
      userId: 1,
      productId: 1,
      totalAmount: 100,
      quantity: 1,
      shippingAddress: '123 Main St, Anytown, USA',
    }
    const order = service.create(createOrderDto)
    expect(order).toEqual({
      id: expect.any(Number),
      ...createOrderDto,
    })
  })
  
})