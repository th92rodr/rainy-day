import nodeGeocoder from 'node-geocoder';

interface Response {
  latitude: number;
  longitude: number;
}

interface GeoCoderResponse {
  data: [
    {
      latitude: number;
      longitude: number;
      formattedAddress: string;
      country: string;
      city: string;
      state: string;
      zipcode?: number;
      streetName?: string;
      streetNumber?: number;
      countryCode: string;
      neighbourhood?: string;
      provider: string;
    },
  ];
}

export default class GeocodingService {
  public async execute(address: string): Promise<Response> {
    const geocoder = nodeGeocoder({
      provider: 'openstreetmap',
    });

    const geoCoderResponse = await geocoder.geocode(address);

    if (geoCoderResponse.length == 0) {
      throw new Error('No coordinates match this address.');
    }

    return this.prepareResponse(geoCoderResponse);
  }

  private prepareResponse(data: nodeGeocoder.Entry[]): Response {
    return {
      latitude: data[0].latitude as number,
      longitude: data[0].longitude as number,
    };
  }
}
