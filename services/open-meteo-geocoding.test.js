import test, { afterEach, beforeEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { OpenMeteoGeocoding } from "./open-meteo-geocoding.js";

describe("OpenMeteoGeocoding", () => {
  const httpClient = {
    async get() {},
  };
  let client;
  beforeEach(() => {
    client = new OpenMeteoGeocoding(httpClient);
    afterEach(() => {
      mock.restoreAll();
    });
  });

  describe("getCoordinatesByCityName()", () => {
    test("should return city location", async () => {
      const responseBody = {
        results: [
          {
            name: "Vinnytsia",
            latitude: 49.2328,
            longitude: 28.4816,
          },
        ],
      };

      mock.method(httpClient, "get", async () => responseBody);

      const { name, latitude, longitude } =
        await client.getCoordinatesByCityName("Vinnytsia");

      assert.equal(name, "Vinnytsia");
      assert.equal(latitude, 49.2328);
      assert.equal(longitude, 28.4816);
    });

    test("should throw an error if city is not found (results an empty array)", async () => {
      mock.method(httpClient, "get", async () => ({ results: [] }));

      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "city Vinnytsia not found",
      });
    });
    test("should throw an error if city is not found (results is undefined)", async () => {
      mock.method(httpClient, "get", async () => ({}));
      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "city Vinnytsia not found",
      });
    });

    test("should throw an error if server returns non-200 status code", async () => {
      mock.method(httpClient, "get", async () => {
        throw new Error("could not fetch data");
      });
      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "could not fetch data",
      });
    });
  });
});
