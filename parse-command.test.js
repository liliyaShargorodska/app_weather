import test, { describe } from "node:test";
import { parseCommand } from "./parse-command.js";
import assert from "node:assert/strict";

describe("parseCommand()", () => {
  test("should return result if 1 positional argument is passed", () => {
    const args = ["current", "--city", "Vinnytsia"];

    const result = parseCommand(args);

    assert.equal(result.command, "current");
    assert.equal(result.options.city, "Vinnytsia");
  });

  test("should an error 0 positional arguments are passed", () => {
    const args = ["--city", "Vinnytsia"];

    assert.throws(() => parseCommand(args), {
      message: "Wrong number of positional arguments: 0",
    });
  });

  test("should an error 2 positional arguments are passed", () => {
    const args = ["current", "weather"];

    assert.throws(() => parseCommand(args), {
      message: "Wrong number of positional arguments: 2",
    });
  });
});
