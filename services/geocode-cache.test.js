import test, { beforeEach, afterEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { GeocodeCache } from "./geocode-cache.js";

describe("GeocodeCache", () => {
  let geocodeProvider;
  let cache;

  beforeEach(() => {
    geocodeProvider = {
      async getCoordinatesByCityName() {},
    };
    cache = new GeocodeCache(geocodeProvider, "some-dir");
  });

  afterEach(() => {
    mock.restoreAll();
  });

  test("should return data from provider and store in cache", async () => {
    mock.method(fs, "readFile", async () => {
      const e = new Error("ENOENT");
      e.code = "ENOENT";
      return e;
    });
    const mockGeocodeProvider = mock.method(
      geocodeProvider,
      "getCoordinatesByCityName",
      async () => ({
        latitude: 49.2328,
        longitude: 28.4816,
      }),
    );
    const mockWriteFile = mock.method(fs, "writeFile", async () => {});

    const result = await cache.getCoordinatesByCityName("Vinnytsia");

    assert.equal(result.latitude, 49.2328);
    assert.equal(result.longitude, 28.4816);

    assert.equal(mockGeocodeProvider.mock.calls.length, 1);
    assert.equal(mockGeocodeProvider.mock.calls[0].arguments[0], "Vinnytsia");

    assert.equal(mockWriteFile.mock.calls.length, 1);
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[0],
      "some-dir/geocode-cache.json",
    );
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[1],
      JSON.stringify({ Vinnytsia: { latitude: 49.2328, longitude: 28.4816 } }),
    );
  });

  test("should return data from cache", async () => {
    mock.method(fs, "readFile", async () => {
      return JSON.stringify({
        Vinnytsia: { latitude: 49.2328, longitude: 28.4816 },
      });
    });

    const mockGeocodeProvider = mock.method(
      geocodeProvider,
      "getCoordinatesByCityName",
      async () => ({}),
    );
    const mockWriteFile = mock.method(fs, "writeFile", async () => {});

    const result = await cache.getCoordinatesByCityName("Vinnytsia");

    assert.equal(result.latitude, 49.2328);
    assert.equal(result.longitude, 28.4816);

    assert.equal(mockGeocodeProvider.mock.calls.length, 0);
    assert.equal(mockWriteFile.mock.calls.length, 0);
  });

  test("should ignore corrupted json file", async () => {
    mock.method(fs, "readFile", async () => "{ corrupted json file }");

    const mockGeocodeProvider = mock.method(
      geocodeProvider,
      "getCoordinatesByCityName",
      async () => ({
        latitude: 49.2328,
        longitude: 28.4816,
      }),
    );
    const mockWriteFile = mock.method(fs, "writeFile", async () => {});

    const result = await cache.getCoordinatesByCityName("Vinnytsia");

    assert.equal(result.latitude, 49.2328);
    assert.equal(result.longitude, 28.4816);

    assert.equal(mockGeocodeProvider.mock.calls.length, 1);
    assert.equal(mockGeocodeProvider.mock.calls[0].arguments[0], "Vinnytsia");

    assert.equal(mockWriteFile.mock.calls.length, 1);
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[0],
      "some-dir/geocode-cache.json",
    );
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[1],
      JSON.stringify({ Vinnytsia: { latitude: 49.2328, longitude: 28.4816 } }),
    );
  });

  test("should ignore read failure", async () => {
    mock.method(fs, "readFile", async () => {
      throw new Error("read failure");
    });

    const mockGeocodeProvider = mock.method(
      geocodeProvider,
      "getCoordinatesByCityName",
      async () => ({
        latitude: 49.2328,
        longitude: 28.4816,
      }),
    );
    const mockWriteFile = mock.method(fs, "writeFile", async () => {});

    const result = await cache.getCoordinatesByCityName("Vinnytsia");

    assert.equal(result.latitude, 49.2328);
    assert.equal(result.longitude, 28.4816);

    assert.equal(mockGeocodeProvider.mock.calls.length, 1);
    assert.equal(mockGeocodeProvider.mock.calls[0].arguments[0], "Vinnytsia");

    assert.equal(mockWriteFile.mock.calls.length, 1);
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[0],
      "some-dir/geocode-cache.json",
    );
    assert.equal(
      mockWriteFile.mock.calls[0].arguments[1],
      JSON.stringify({ Vinnytsia: { latitude: 49.2328, longitude: 28.4816 } }),
    );
  });
});
