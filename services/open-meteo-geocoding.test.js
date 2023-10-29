import test, { beforeEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { OpenMeteoGeocoding } from "./open-meteo-geocoding.js";

describe("OpenMeteoGeocoding", async () => {
  let client;
  beforeEach(() => {
    client = new OpenMeteoGeocoding();
  });

  describe("getCoordinatesByCityName()", () => {
    test("should return city location", async () => {
      mockFetchOnce({
        body: {
          results: [
            {
              name: "Vinnytsia",
              latitude: 49.2328,
              longitude: 28.4816,
            },
          ],
        },
      });

      const { name, latitude, longitude } =
        await client.getCoordinatesByCityName("Vinnytsia");

      assert.equal(name, "Vinnytsia");
      assert.equal(latitude, 49.2328);
      assert.equal(longitude, 28.4816);
    });

    test("should throw an error if city is not found (results an empty array)", async () => {
      mockFetchOnce({
        body: {
          results: [],
        },
      });

      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "city Vinnytsia not found",
      });
    });
    test("should throw an error if city is not found (results is undefined)", async () => {
      mockFetchOnce({
        body: {},
      });

      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "city Vinnytsia not found",
      });
    });

    test("should throw an error if server returns non-200 status code", async () => {
      mockFetchOnce({
        status: 500,
      });

      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "could not fetch data",
      });
    });

    test("should throw an error if failed to fetch", async () => {
      mockFetchOnce({
        error: new Error("failed to fetch"),
      });

      await assert.rejects(() => client.getCoordinatesByCityName("Vinnytsia"), {
        message: "could not fetch data",
        cause: new Error("failed to fetch"),
      });
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
