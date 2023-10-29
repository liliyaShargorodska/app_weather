import test, { beforeEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { OpenMeteo } from "./open-meteo.js";

describe("OpenMeteo", () => {
  let client;
  beforeEach(() => {
    client = new OpenMeteo();
  });

  describe("getCurrentWeatherByCoordinates()", () => {
    test("should return current weather", async () => {
      const time = dateRounded(new Date());
      const expectedTemperature = 21;

      mockFetchOnce({
        body: {
          current_weather: {
            temperature: expectedTemperature,
            time,
          },
        },
      });

      const weather = await client.getCurrentWeatherByCoordinates(
        "49.2328",
        "28.4816",
      );

      assert.equal(weather.temperature, 21);
      assert.equal(weather.time.getTime(), time.getTime());
    });

    test("should throw an error if server returns non-200 status code", async () => {
      mockFetchOnce({ status: 500 });

      await assert.rejects(
        () => client.getCurrentWeatherByCoordinates("49.2328", "28.4816"),
        {
          message: "could not fetch weather data",
        },
      );
    });

    test("should throw an error if failed to fetch", async () => {
      const expectedError = new Error("failed to fetch");
      mockFetchOnce({ error: expectedError });

      await assert.rejects(
        () => client.getCurrentWeatherByCoordinates("49.2328", "28.4816"),
        {
          message: "could not fetch weather data",
          cause: expectedError,
        },
      );
    });
  });
});

function mockFetchOnce({ error, status, body } = { status: 200 }) {
  return mock.method(
    globalThis,
    "fetch",
    async () => {
      if (error) {
        throw error;
      }
      return new Response(JSON.stringify(body), {
        status: status || 200,
      });
    },
    { times: 1 },
  );
}

function dateRounded(date) {
  const newDate = new Date(date);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}
