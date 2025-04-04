import * as Joi from 'joi'

export const expectMissingField = (
  schema: Joi.ObjectSchema,
  data: Record<string, any>,
  missingFieldMessage: string
) => {
  const result = schema.validate(data)
  expect(result.error).toBeDefined()
  expect(result.error?.message).toContain(missingFieldMessage)
}
