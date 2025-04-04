import { getClassSchema } from 'nestjs-joi';
import { CreateOrderDto } from "./create-order.dto"
import * as Joi from 'joi'
import { expectMissingField } from '../../utils/joi-test'

describe('CreateOrderDto Joi Schema', () => {
  const schema = getClassSchema(CreateOrderDto) as Joi.ObjectSchema;

  it('should throw an error when shippingAddress is not a string', () => {
    expectMissingField(schema, {
      userId: 1,
      productId: 2,
      quantity: 1,
      shippingAddress: 12345,
      totalAmount: 99,
    }, 'Shipping address is required')
  });

  it('should throw an error when userId is missing', () => {
    expectMissingField(schema, {
      productId: 2,
      quantity: 1,
      shippingAddress: '123 Main St',
      totalAmount: 99,
    }, 'User id is required')
  });

});
