import request from 'supertest';

import app from '../app';

describe('Weather', () => {
  it('should be able to get the current weather', async () => {
    const cityName = 'London';
    const response = await request(app).get(`/weather/${cityName}/current`);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        cityName: expect.any(String),
        country: expect.any(String),
        coordinates: expect.objectContaining({
          longitude: expect.any(Number),
          latitude: expect.any(Number),
        }),
        temperature: expect.any(Number),
        feelsLike: expect.any(Number),
        temperatureMin: expect.any(Number),
        temperatureMax: expect.any(Number),
        pressure: expect.any(Number),
        humidity: expect.any(Number),
        windSpeed: expect.any(Number),
        cloudiness: expect.any(Number),
        sunrise: expect.any(Number),
        sunset: expect.any(Number),
      }),
    );
  });

  it('should not be able to get the current weather of an invalid city', async () => {
    const cityName = 'Fake Name';
    const response = await request(app).get(`/weather/${cityName}/current`);

    expect(response.status).toEqual(400);
  });
});
