import { Request, Response } from 'express';

import GetCurrentWeatherService from '../services/GetCurrentWeather.service';

export default class WeatherController {
  public async getCurrentWeather(request: Request, response: Response) {
    const { city } = request.params;

    try {
      const getCurrentWeatherService = new GetCurrentWeatherService();

      const currentWeather = await getCurrentWeatherService.execute({ city });

      return response.json(currentWeather);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
