export class HttpClient {
  constructor() {}

  async get(basePath, params) {
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
      const err = new Error(`could not fetch data`);
      err.cause = e;
      throw err;
    }
  }
}
