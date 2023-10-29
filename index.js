console.log("The Weather CLI App");
import { parseCommand } from "./parse-command.js";

console.log("The Weather CLI App");

try {
  const command = parseCommand(process.argv.slice(2));
  console.log(command);
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
