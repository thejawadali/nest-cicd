import { PartialType } from "@nestjs/mapped-types"
import * as Joi from "joi"
import { JoiSchema } from "nestjs-joi"
import { ValidationError } from "../../utils/validation.ext"

export class CreateOrderDto {
  @JoiSchema(
    Joi.number().required().error(ValidationError('User id is required')),
  ) 
  userId: number;

  @JoiSchema(
    Joi.number().required().error(ValidationError('Product id is required')),
  )
  productId: number;

  @JoiSchema(
    Joi.number().required().error(ValidationError('Quantity is required')),
  )
  quantity: number;

  @JoiSchema(
    Joi.string().required().error(ValidationError('Shipping address is required')),
  )
  shippingAddress: string;

  @JoiSchema(
    Joi.number().required().error(ValidationError('Total amount is required')),
  )
  totalAmount: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
