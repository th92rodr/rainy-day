interface Request {
  city: string;
  state?: string;
  country: string;
  address: string;
  type?: string;
  number: number;
}

export default class BuildAddressStringService {
  public execute(request: Request): string {
    const { city, state, country, address, type, number } = request;

    return `${type} ${address},${number},${city},${state},${country}`;
  }
}
