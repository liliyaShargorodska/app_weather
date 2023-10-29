import { parseCommand } from "./parse-command.js";
import { getCurrentWeather } from "./command/current.js";
import { OpenMeteo } from "./services/open-meteo.js";

console.log("The Weather CLI App");

const weatherProvider = new OpenMeteo();

try {
  const command = parseCommand(process.argv.slice(2));
  if (command.command === "current") {
    await getCurrentWeather(weatherProvider, command.options);
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
