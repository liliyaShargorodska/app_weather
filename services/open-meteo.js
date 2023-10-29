const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteo {
  #httpClient;
  constructor(httpClient) {
    this.#httpClient = httpClient;
  }

  async getCurrentWeatherByCoordinates(lat, long) {
    const result = await this.#httpClient.get(FORECAST_URL, {
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
