import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { DataSource } from "typeorm"
import { Order } from '../src/orders/entities/order.entity'

// Set test environment before any imports that might use env variables
process.env.NODE_ENV = 'test'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let db: DataSource

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    db = app.get(DataSource)
  })

  // afterAll(async () => {
  //   await db.query('DELETE FROM orders;');
  // });

  afterAll(async () => {
    await app.close()
  })

  describe('POST /orders', () => {
    it('should create order when valid data is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: 1,
          productId: 1,
          quantity: 12,
          shippingAddress: '123 Main St, Anytown, USA',
          totalAmount: 100
        })
        .expect(201)

      expect(response.body.id).toBeDefined()
      expect(response.body.userId).toStrictEqual(expect.any(Number))
      expect(response.body.productId).toBe(1)
      expect(response.body.quantity).toBe(12)
      expect(response.body.shippingAddress).toBe('123 Main St, Anytown, USA')
      expect(response.body.totalAmount).toBe(100)
    })

    it('should return 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: 1,
          // missing productId
          quantity: 12,
          shippingAddress: '123 Main St, Anytown, USA',
          totalAmount: 100
        })
        .expect(400)
    })

    it('should return 400 when fields have invalid values', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: 1,
          productId: 1,
          quantity: 2,
          shippingAddress: '123 Main St, Anytown, USA',
          totalAmount: 100
        })
        .expect(400)
    })
  })

  let order: Order

  it('/orders (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .expect(200)
    order = response.body[0]

    expect(response.body).toStrictEqual(expect.any(Array))
    expect(order.id).toBeDefined()
    expect(order.userId).toStrictEqual(order.userId)
    expect(order.productId).toBe(order.productId)
    expect(order.quantity).toBe(order.quantity)
  })


  describe('/orders/:id (GET)', () => {
    it('should return order when found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/orders/${order.id}`)
        .expect(200)

      expect(response.body.id).toBe(order.id)
      expect(response.body.userId).toStrictEqual(order.userId)
      expect(response.body.productId).toBe(order.productId)
      expect(response.body.totalAmount).toBe(order.totalAmount)
    })

    it('should return 404 when order not found', async () => {
      await request(app.getHttpServer())
        .get(`/orders/${order.id - 1}`)
        .expect(204)
    })
  })

  describe('/orders/:id (PATCH)', () => {
    it('should update order when valid data is provided', async () => {

      const response = await request(app.getHttpServer())
        .patch(`/orders/${order.id}`)
        .send({
          quantity: 20,
          shippingAddress: '456 Oak Ave, Anytown, USA',
          totalAmount: 200
        })
        .expect(200)

      expect(response.body.id).toBe(order.id)
      expect(response.body.userId).toStrictEqual(order.userId)
      expect(response.body.productId).toBe(order.productId)
      expect(response.body.quantity).toBe(20)
      expect(response.body.shippingAddress).toBe('456 Oak Ave, Anytown, USA')
      expect(response.body.totalAmount).toBe(200)
    })

    it('should return 204 when order not found', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${order.id - 1}`)
        .send({
          quantity: 20,
        })
        .expect(204)
    })
  })

  // describe('/orders/:id (DELETE)', () => {
  //   it('should delete order when found', async () => {
  //     await request(app.getHttpServer())
  //       .delete(`/orders/${order.id}`)
  //       .expect(200)
  //   })

  //   it('should return 404 when order not found', async () => {
  //     await request(app.getHttpServer())
  //       .delete(`/orders/${order.id - 1}`)
  //       .expect(204)
  //   })
  // })
})
