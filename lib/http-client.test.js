import test, { beforeEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { HttpClient } from "./http-client.js";

describe("HttpClient", () => {
  let client;
  beforeEach(() => {
    client = new HttpClient();
  });

  describe("get()", () => {
    test("should return response from server", async () => {
      const body = { hello: "world" };

      const mockedFetch = mockFetchOnce({ body });

      const response = await client.get("https://example.com", {
        key: "value",
      });

      assert.deepStrictEqual(response, body);

      const [actualURL] = mockedFetch.mock.calls[0].arguments;
      assert.equal(actualURL.toString(), "https://example.com/?key=value");
    });

    test("should throw an error if server returns non-200 status code", async () => {
      const mockedFetch = mockFetchOnce({ status: 500 });

      await assert.rejects(
        () => client.get("https://example.com", { key: "value" }),
        {
          message: "could not fetch data",
        },
      );

      const [actualURL] = mockedFetch.mock.calls[0].arguments;
      assert.equal(actualURL.toString(), "https://example.com/?key=value");
    });

    test("should throw an error if failed to fetch", async () => {
      const expectedError = new Error("failed to fetch");
      const mockedFetch = mockFetchOnce({ error: expectedError });

      await assert.rejects(
        () => client.get("https://example.com", { key: "value" }),
        {
          message: "could not fetch data",
          cause: expectedError,
        },
      );

      const [actualURL] = mockedFetch.mock.calls[0].arguments;
      assert.equal(actualURL.toString(), "https://example.com/?key=value");
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
