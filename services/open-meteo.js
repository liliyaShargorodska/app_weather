const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteo {
  constructor() {}

  async #call(basePath, params) {
    const url = new URL(basePath);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const resp = await fetch(url);
    return await resp.json();
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
