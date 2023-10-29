import test, { afterEach, describe, mock } from "node:test";
import { getCurrentWeather, validate } from "./current.js";
import assert from "node:assert/strict";

describe("validate()", () => {
  test("should not throw an error if city is passed", () => {
    assert.doesNotThrow(() => validate({ city: "Vinnytsia" }));
  });

  test("should not throw an error if lat and long are passed", () => {
    assert.doesNotThrow(() => validate({ lat: "49.2328", long: "28.4816" }));
  });

  test("should not throw an error if both city and lat/long are passed", () => {
    assert.doesNotThrow(() =>
      validate({ city: "Vinnytsia", lat: "49.2328", long: "28.4816" }),
    );
  });

  test("should throw an error if only lat is passed", () => {
    assert.throws(() => validate({ lat: "49.2328" }), {
      message: "Either city or lat and long should be present",
    });
  });

  test("should throw an error if only long is passed", () => {
    assert.throws(() => validate({ long: "28.4816" }), {
      message: "Either city or lat and long should be present",
    });
  });

  test("should throw an error if neither city nor lat and long are passed", () => {
    assert.throws(() => validate({}), {
      message: "Either city or lat and long should be present",
    });
  });

  test("should throw an error if city name length less than 2 characters", () => {
    assert.throws(() => validate({ city: "a" }), {
      message: "City name should be longer than 2 characters",
    });
  });

  test("should throw an error if latitude is not a number", () => {
    assert.throws(() => validate({ lat: "abc", long: "28.4816" }), {
      message: "Latitude should be a number between -90 and 90",
    });
  });

  test("should throw an error if latitude is not a number between -90 and 90", () => {
    assert.throws(() => validate({ lat: "91", long: "28.4816" }), {
      message: "Latitude should be a number between -90 and 90",
    });
  });

  test("should throw an error if longitude is not a number", () => {
    assert.throws(() => validate({ lat: "49.2328", long: "abc" }), {
      message: "Longitude should be a number between -180 and 180",
    });
  });

  test("should throw an error if longitude is not a number between -180 and 180", () => {
    assert.throws(() => validate({ lat: "49.2328", long: "181" }), {
      message: "Longitude should be a number between -180 and 180",
    });
  });
});

describe("getCurrentWeather()", () => {
  let weatherProvider = {
    async getCurrentWeatherByCoordinates() {},
  };
  let geocodeProvider = {
    async getCoordinatesByCityName() {},
  };

  afterEach(() => {
    mock.restoreAll();
  });

  test("should return weather by coordinates", async () => {
    const expectedTime = new Date();
    const expectedTemperature = 21;
    const expectedLat = "49.2328";
    const expectedLong = "28.4816";

    const mockCurrentWeather = mock.method(
      weatherProvider,
      "getCurrentWeatherByCoordinates",
      async () => ({
        temperature: expectedTemperature,
        time: expectedTime,
        lat: expectedLat,
        long: expectedLong,
      }),
    );

    const logMock = mock.method(console, "log", () => {}, { times: 1 });

    await getCurrentWeather(weatherProvider, geocodeProvider, {
      lat: expectedLat,
      long: expectedLong,
    });

    assert.equal(logMock.mock.calls.length, 1);
    assert.equal(
      logMock.mock.calls[0].arguments[0],
      `Current weather in ${expectedLat} ${expectedLong}: ${expectedTemperature} °C (time: ${expectedTime})`,
    );

    assert.equal(mockCurrentWeather.mock.calls.length, 1);
    assert.equal(mockCurrentWeather.mock.calls[0].arguments[0], expectedLat);
    assert.equal(mockCurrentWeather.mock.calls[0].arguments[1], expectedLong);
  });

  test("should return weather by city name", async () => {
    const expectedTime = new Date();
    const expectedTemperature = 21;
    const expectedLat = "49.2328";
    const expectedLong = "28.4816";
    const expectedName = "Vinnytsia";

    const mockCurrentWeather = mock.method(
      weatherProvider,
      "getCurrentWeatherByCoordinates",
      async () => ({
        temperature: expectedTemperature,
        time: expectedTime,
        city: expectedName,
      }),
    );

    mock.method(geocodeProvider, "getCoordinatesByCityName", async () => ({
      name: expectedName,
      latitude: expectedLat,
      longitude: expectedLong,
    }));

    const logMock = mock.method(console, "log", () => {}, { times: 1 });

    await getCurrentWeather(weatherProvider, geocodeProvider, {
      city: "Vinnyt",
    });

    assert.equal(logMock.mock.calls.length, 1);
    assert.equal(
      logMock.mock.calls[0].arguments[0],
      `Current weather in ${expectedName}: ${expectedTemperature} °C (time: ${expectedTime})`,
    );

    assert.equal(mockCurrentWeather.mock.calls.length, 1);
    assert.equal(mockCurrentWeather.mock.calls[0].arguments[0], expectedLat);
    assert.equal(mockCurrentWeather.mock.calls[0].arguments[1], expectedLong);
  });
});
