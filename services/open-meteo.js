const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteo {
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
      const err = new Error(`could not fetch weather data`);
      err.cause = e;
      throw err;
    }
  }

  async getCurrentWeatherByCoordinates(lat, long) {
    const result = await this.#call(FORECAST_URL, {
      latitude: lat,
      longitude: long,
      current_weather: "true",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const { time, temperature } = result.current_weather;

    return {
      temperature,
      time: new Date(time),
    };
  }
}
