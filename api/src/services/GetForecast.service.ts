import axios from 'axios';

import GeocodingService from './Geocoding.service';
import OpenWeatherConfig from '../config/openWeather';
import BuildAddressStringService from './BuildAddressString.service';

interface Request {
  search: string;

  city?: string;
  state?: string;
  country?: string;
  address?: string;
  type?: string;
  number?: number;

  latitude?: number;
  longitude?: number;
}

interface Daily {
  sunrise: number;
  sunset: number;
  temperature: {
    day: number;
    min: number;
    max: number;
    night: number;
    evening: number;
    morning: number;
  };
  feelsLike: {
    day: number;
    night: number;
    evening: number;
    morning: number;
  };
  pressure: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  weatherFullDescription: string;
  clouds: number;
  rain: number;
  uvi: number;
}

interface Hourly {
  temperature: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  weatherFullDescription: string;
}

interface Response {
  coordinates: {
    longitude: number;
    latitude: number;
  };
  daily: Daily[];
  hourly: Hourly[];
}

interface OpenWeatherResponse {
  status: number;
  headers: Object;

  data: {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: {
      dt: number;
      sunrise: number;
      sunset: number;
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      dew_point: number;
      uvi: number;
      clouds: number;
      visibility: number;
      wind_speed: number;
      wind_deg: number;
      weather: [
        {
          id: number;
          main: string;
          description: string;
          icon: string;
        },
      ];
      rain: {
        '1h': string;
      };
    };

    hourly: [
      {
        dt: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        clouds: number;
        wind_speed: number;
        wind_deg: number;
        weather: [
          {
            id: number;
            main: string;
            description: string;
            icon: string;
          },
        ];
        rain: {
          '1h': number;
        };
      },
    ];
    daily: [
      {
        dt: number;
        sunrise: number;
        sunset: number;
        temp: {
          day: number;
          min: number;
          max: number;
          night: number;
          eve: number;
          morn: number;
        };
        feels_like: {
          day: number;
          night: number;
          eve: number;
          morn: number;
        };
        pressure: number;
        humidity: number;
        dew_point: number;
        wind_speed: number;
        wind_deg: number;
        weather: [
          {
            id: number;
            main: string;
            description: string;
            icon: string;
          },
        ];
        clouds: number;
        rain: number;
        uvi: number;
      },
    ];
    minutely: [
      {
        dt: number;
        precipitation: number;
      },
    ];
  };
}

export default class GetForecastService {
  public async execute(request: Request): Promise<Response> {
    const openWeatherURL = await this.getOpenWeatherApiUrl(request);

    const response: OpenWeatherResponse = await axios.get(openWeatherURL);

    if (!this.verifyResponse(response)) {
      throw new Error('Get Forecast Failed.');
    }

    return this.prepareResponse(response);
  }

  private async getOpenWeatherApiUrl(request: Request): Promise<string> {
    const { APIKey } = OpenWeatherConfig;
    const languageCode = this.getDesiredLanguage();

    if (request.search === 'address') {
      const buildAddressStringService = new BuildAddressStringService();

      const fullAddress = buildAddressStringService.execute({
        city: request.city as string,
        state: request.state,
        country: request.country as string,
        address: request.address as string,
        type: request.type,
        number: request.number as number,
      });

      const geocodingService = new GeocodingService();

      const { latitude, longitude } = await geocodingService.execute(
        fullAddress,
      );

      return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=${languageCode}&appid=${APIKey}`;
    } else if (request.search === 'coords') {
      const { latitude, longitude } = request;

      return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=${languageCode}&appid=${APIKey}`;
    } else {
      throw new Error('Invalid search type.');
    }
  }

  private getDesiredLanguage(): string {
    const { language } = OpenWeatherConfig;

    switch (language) {
      case 'English':
        return 'en';
      case 'Portuguese':
        return 'pt_br';
      case 'Spanish':
        return 'es';
      default:
        return 'en';
    }
  }

  private verifyResponse({ status, data }: OpenWeatherResponse): Boolean {
    if (status !== 200) {
      return false;
    }
    if (data == null || data == undefined) {
      return false;
    }

    return true;
  }

  private prepareResponse({ data }: OpenWeatherResponse): Response {
    const daily: Response['daily'] = data.daily.map(day => ({
      sunrise: day.sunrise,
      sunset: day.sunset,
      pressure: day.pressure,
      humidity: day.humidity,
      windSpeed: day.wind_speed,
      weatherDescription: day.weather[0].main,
      weatherFullDescription: day.weather[0].description,
      clouds: day.clouds,
      rain: day.rain,
      uvi: day.uvi,
      temperature: {
        day: day.temp.day,
        min: day.temp.min,
        max: day.temp.max,
        night: day.temp.night,
        evening: day.temp.eve,
        morning: day.temp.morn,
      },
      feelsLike: {
        day: day.feels_like.day,
        night: day.feels_like.night,
        evening: day.feels_like.eve,
        morning: day.feels_like.morn,
      },
    }));

    const hourly: Response['hourly'] = data.hourly.map(hour => {
      return {
        temperature: hour.temp,
        feelsLike: hour.feels_like,
        pressure: hour.pressure,
        humidity: hour.humidity,
        windSpeed: hour.wind_speed,
        weatherDescription: hour.weather[0].main,
        weatherFullDescription: hour.weather[0].description,
      };
    });

    return {
      coordinates: {
        latitude: data.lat,
        longitude: data.lon,
      },
      daily,
      hourly,
    };
  }
}
