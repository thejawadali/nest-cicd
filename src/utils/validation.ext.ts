import { HttpException } from '@nestjs/common';
import * as Joi from 'joi'

export const ValidationError = (str: string) => {
  return new HttpException(str, 400);
};

export const PhoneNumberSchema = Joi.string()
  .pattern(/^\+?[0-9]{10,15}$/)
  .message('Phone number must be 10-15 digits and may start with +');
