import { Request, Response } from 'express';

import GetForecastService from '../services/GetForecast.service';
import GetCurrentWeatherService from '../services/GetCurrentWeather.service';

export default class WeatherController {
  public async getCurrentWeather(request: Request, response: Response) {
    const { search } = request.params;

    const getCurrentWeatherService = new GetCurrentWeatherService();

    try {
      const currentWeather = await getCurrentWeatherService.execute({
        search,

        city: request.query.city as string | undefined,
        state: request.query.state as string | undefined,
        country: request.query.country as string | undefined,

        latitude: request.query.latitude as number | undefined,
        longitude: request.query.longitude as number | undefined,
      });

      return response.json(currentWeather);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  public async getForecast(request: Request, response: Response) {
    const { search } = request.params;

    const getForecastService = new GetForecastService();

    try {
      const forecast = await getForecastService.execute({
        search,

        city: request.query.city as string | undefined,
        state: request.query.state as string | undefined,
        country: request.query.country as string | undefined,
        address: request.query.address as string | undefined,
        type: request.query.type as string | undefined,
        number: request.query.number as number | undefined,

        latitude: request.query.latitude as number | undefined,
        longitude: request.query.longitude as number | undefined,
      });

      return response.json(forecast);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
