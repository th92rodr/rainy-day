import request from 'supertest';

import app from '../app';

describe('Weather', () => {
  it('should be able to get the current weather by address', async () => {
    const country = 'BR';
    const state = 'SP';
    const city = 'Campinas';

    const response = await request(app).get(
      `/weather/address?country=${country}&state=${state}&city=${city}`,
    );

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

  it('should be able to get the current weather by coordinates', async () => {
    const latitude = -22.8920562;
    const longitude = -47.2083213;

    const response = await request(app).get(
      `/weather/coords?latitude=${latitude}&longitude=${longitude}`,
    );

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
    const country = 'Fake';
    const state = 'Fake';
    const city = 'Fake Name';

    const response = await request(app).get(
      `/weather/address?country=${country}&state=${state}&city=${city}`,
    );

    expect(response.status).toEqual(400);
  });

  it('should be able to get the forecast by address', async () => {
    const country = 'BR';
    const state = 'SP';
    const city = 'Campinas';
    const address = 'Dr. Heitor Penteado';
    const type = 'Avenida';
    const number = 1671;

    const response = await request(app).get(
      `/weather/forecast/address?country=${country}&state=${state}&city=${city}&address=${address}&type=${type}&number=${number}`,
    );

    expect(response.status).toEqual(200);
  });

  it('should be able to get the forecast by coordinates', async () => {
    const latitude = -22.8920562;
    const longitude = -47.2083213;

    const response = await request(app).get(
      `/weather/forecast/coords?latitude=${latitude}&longitude=${longitude}`,
    );

    expect(response.status).toEqual(200);
  });

  it('should not be able to get the forecast of an invalid city', async () => {
    const country = 'Fake';
    const state = 'Fake';
    const city = 'Fake City';
    const address = 'Fake Address';
    const type = 'Fake Street';
    const number = 0;

    const response = await request(app).get(
      `/weather/forecast/address?country=${country}&state=${state}&city=${city}&address=${address}&type=${type}&number=${number}`,
    );

    expect(response.status).toEqual(400);
  });
});
