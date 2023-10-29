import test, { afterEach, beforeEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { OpenMeteo } from "./open-meteo.js";

describe("OpenMeteo", () => {
  const httpClient = {
    async get() {},
  };
  let client;
  beforeEach(() => {
    client = new OpenMeteo(httpClient);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe("getCurrentWeatherByCoordinates()", () => {
    test("should return current weather", async () => {
      const time = dateRounded(new Date());
      const expectedTemperature = 21;

      const responseBody = {
        current_weather: {
          temperature: expectedTemperature,
          time,
        },
      };

      mock.method(httpClient, "get", async () => responseBody);

      const weather = await client.getCurrentWeatherByCoordinates(
        "49.2328",
        "28.4816",
      );

      assert.equal(weather.temperature, 21);
      assert.equal(weather.time.getTime(), time.getTime());
    });

    test("should throw an error if server returns non-200 status code", async () => {
      mock.method(httpClient, "get", async () => {
        throw new Error("could not fetch data");
      });

      await assert.rejects(
        () => client.getCurrentWeatherByCoordinates("49.2328", "28.4816"),
        {
          message: "could not fetch data",
        },
      );
    });
  });
});

function dateRounded(date) {
  const newDate = new Date(date);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}
