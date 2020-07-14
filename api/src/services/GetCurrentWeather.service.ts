import axios from 'axios';

import OpenWeatherConfig from '../config/openWeather';

interface Request {
  search: string;

  city?: string;
  state?: string;
  country?: string;

  latitude?: number;
  longitude?: number;
}

interface Response {
  cityName: string;
  country: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  temperature: number;
  feelsLike: number;
  temperatureMin: number;
  temperatureMax: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  weatherFullDescription: string;
  cloudiness: number;
  sunrise: number;
  sunset: number;
}

interface OpenWeatherResponse {
  status: number;
  headers: Object;

  data: {
    coord: {
      lon: number;
      lat: number;
    };
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      },
    ];
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level: number; // Atmospheric pressure on the sea level, hPa
      grnd_level: number; // Atmospheric pressure on the ground level, hPa
    };
    wind: {
      speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
      deg: number; // Wind direction, degrees (meteorological)
      gust: number;
    };
    clouds: {
      all: number; // Cloudiness, %
    };
    rain: {
      '1h': number; // Rain volume for the last 1 hour, mm
      '3h': number; // Rain volume for the last 3 hours, mm
    };
    snow: {
      '1h': number; // Snow volume for the last 1 hour, mm
      '3h': number; // Snow volume for the last 3 hours, mm
    };
    dt: number; // Time of data calculation, unix, UTC
    sys: {
      type: number;
      id: number;
      message: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number; // City ID
    name: string; // City name
    cod: number;
  };
}

export default class GetCurrentWeatherService {
  public async execute(request: Request): Promise<Response> {
    const openWeatherURL = this.getOpenWeatherApiUrl(request);

    const response: OpenWeatherResponse = await axios.get(openWeatherURL);

    if (!this.verifyResponse(response)) {
      throw new Error('Open Weather Request Failed.');
    }

    return this.prepareResponse(response);
  }

  private getOpenWeatherApiUrl(request: Request): string {
    const { APIKey } = OpenWeatherConfig;
    const languageCode = this.getDesiredLanguage();

    if (request.search === 'address') {
      const { city, state, country } = request;

      return `http://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=metric&appid=${APIKey}&lang=${languageCode}`;
    } else if (request.search === 'coords') {
      const { latitude, longitude } = request;

      return `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}&lang=${languageCode}`;
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
    return {
      cityName: data.name,
      country: data.sys.country,
      coordinates: {
        longitude: data.coord.lon,
        latitude: data.coord.lat,
      },
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      temperatureMin: data.main.temp_min,
      temperatureMax: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherDescription: data.weather[0].main,
      weatherFullDescription: data.weather[0].description,
      cloudiness: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  }
}
