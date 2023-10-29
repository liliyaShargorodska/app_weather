const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const DEFAULT_RESULT_COUNT = 1;

export class OpenMeteoGeocoding {
  #httpClient;
  constructor(httpClient) {
    this.#httpClient = httpClient;
  }

  async getCoordinatesByCityName(name) {
    const response = await this.#httpClient.get(GEOCODE_URL, {
      name,
      count: DEFAULT_RESULT_COUNT,
    });

    const results = response.results ?? [];
    if (results.length === 0) {
      throw new Error(`city ${name} not found`);
    }

    return results[0];
  }
}
