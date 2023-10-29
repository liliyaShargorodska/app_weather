const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const DEFAULT_RESULT_COUNT = 1;

export class OpenMeteoGeocoding {
  constructor() {}

  async #call(basePath, params) {
    const url = new URL(basePath);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    try {
      const resp = await fetch(url);
      if (resp.status !== 200) {
        throw new Error(
          `status code: ${resp.status}, body: ${await resp.text()}`,
        );
      }
      return await resp.json();
    } catch (e) {
      const err = new Error(`could not fetch data`);
      err.cause = e;
      throw err;
    }
  }

  async getCoordinatesByCityName(name) {
    const response = await this.#call(GEOCODE_URL, {
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
