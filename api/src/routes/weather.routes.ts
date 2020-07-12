import { Router } from 'express';

import WeatherController from '../controllers/weather.controller';

const weatherRoutes = Router();

const weatherController = new WeatherController();

weatherRoutes.get('/:city/current', weatherController.getCurrentWeather);

export default weatherRoutes;
