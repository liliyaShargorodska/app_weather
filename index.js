import { parseCommand } from "./parse-command.js";
import { getCurrentWeather } from "./command/current.js";
import { OpenMeteo } from "./services/open-meteo.js";
import { OpenMeteoGeocoding } from "./services/open-meteo-geocoding.js";
import { HttpClient } from "./lib/http-client.js";
import { GeocodeCache } from "./services/geocode-cache.js";
import path from "node:path";
import os from "node:os";

console.log("The Weather CLI App");

const httpClient = new HttpClient();
const weatherProvider = new OpenMeteo(httpClient);
const geocodingProvider = new OpenMeteoGeocoding(httpClient);

const appDataDir = resolveAppDataDir();

const geocodeCache = new GeocodeCache(geocodingProvider, appDataDir);

try {
  const command = parseCommand(process.argv.slice(2));
  if (command.command === "current") {
    await getCurrentWeather(weatherProvider, geocodeCache, command.options);
  } else {
    throw new Error(`Unknown command: ${command.command}`);
  }
} catch (e) {
  let currentError = e;
  let msg = currentError.message;
  while (currentError.cause) {
    currentError = currentError.cause;
    msg += `: ${currentError.message}`;
  }

  console.error(msg);
  process.exit(1);
}
function resolveAppDataDir() {
  if (process.env.WEATHER_APPLICATION_DATA) {
    return process.env.WEATHER_APPLICATION_DATA;
  }
  return path.join(os.homedir(), ".weather-cli");
}
