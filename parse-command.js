import { parseArgs } from "node:util";

export function parseCommand(args) {
  const options = {
    city: {
      type: "string",
      short: "c",
    },
    lat: {
      type: "string",
    },
    long: {
      type: "string",
    },
  };

  const { values, positionals } = parseArgs({
    args,
    options,
    allowPositionals: true,
  });

  if (positionals.length !== 1) {
    throw new Error(
      `Wrong number of positional arguments: ${positionals.length}`,
    );
  }

  return {
    command: positionals[0],
    options: values,
  };
}
