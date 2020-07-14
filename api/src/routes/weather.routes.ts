import { Router } from 'express';
import { celebrate } from 'celebrate';

import celebrateConfig from '../config/celebrate';
import WeatherController from '../controllers/weather.controller';
import { forecastValidationSchema } from '../middlewares/validationSchemas';

const weatherRoutes = Router();

const weatherController = new WeatherController();

weatherRoutes.get(
  '/:search',
  celebrate(forecastValidationSchema, celebrateConfig),
  weatherController.getCurrentWeather,
);
weatherRoutes.get(
  '/forecast/:search',
  celebrate(forecastValidationSchema, celebrateConfig),
  weatherController.getForecast,
);

export default weatherRoutes;
