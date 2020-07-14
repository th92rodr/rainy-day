import { Joi } from 'celebrate';

const searchEnum = ['address', 'coords'];

const forecastValidationSchema = {
  params: {
    search: Joi.string()
      .required()
      .valid(...searchEnum),
  },
};

export { forecastValidationSchema };
