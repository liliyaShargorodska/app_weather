import fs from "node:fs/promises";
import path from "node:path";
const CACHE_FILE = "./geocode-cache.json";

export class GeocodeCache {
  #geocodeProvider;
  #cacheDir;

  constructor(geocodeProvider, cacheDir) {
    this.#geocodeProvider = geocodeProvider;
    this.#cacheDir = cacheDir;
  }

  async getCoordinatesByCityName(name) {
    const cache = await this.#readFromCache();
    if (cache[name]) {
      return cache[name];
    }

    const result = await this.#geocodeProvider.getCoordinatesByCityName(name);

    cache[name] = result;
    await this.#writeToCache(cache);
    return result;
  }

  async #writeToCache(cache) {
    const json = JSON.stringify(cache);
    try {
      await fs.writeFile(this.#fileName(), json);
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.mkdir(this.#cacheDir);
        await fs.writeFile(this.#fileName(), json);
      } else {
        throw err;
      }
    }
  }

  async #readFromCache() {
    let content;
    try {
      content = await fs.readFile(this.#fileName(), "utf-8");
    } catch (err) {
      if (err.code === "ENOENT") {
        return {};
      } else {
        console.warn("Warning: could not read cache file: ", err.message);
        return {};
      }
    }

    let json;
    try {
      json = JSON.parse(content);
    } catch (err) {
      console.warn("Warning: could not parse cache file: ", err.message);
      return {};
    }
    return json;
  }

  #fileName() {
    return path.join(this.#cacheDir, CACHE_FILE);
  }
}
