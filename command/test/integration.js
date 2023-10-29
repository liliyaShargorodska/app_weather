import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

describe("Integration tests", () => {
  describe("current", () => {
    const fixtures = [
      {
        args: ["current", "--city", "Vinnytsia"],
        expected: {
          code: 0,
          stdout: /^Current weather in Vinnytsia: \d{1,2}.\d{0,2}.*$/m,
          stderr: /^$/,
        },
      },
      {
        args: ["current", "--lat", "49.2328", "--long", "28.4816"],
        expected: {
          code: 0,
          stdout: /^Current weather in 49.2328 28.4816: \d{1,2}.\d{0,2}.*$/m,
          stderr: /^$/,
        },
      },
      {
        args: ["current", "--lat", "49.2328"],
        expected: {
          code: 1,
          stderr: /Either city or lat and long should be present/,
        },
      },
      {
        args: ["current", "--city", "A"],
        expected: {
          code: 1,
          stderr: /City name should be longer than 2 character/,
        },
      },
      {
        args: ["current", "current"],
        expected: {
          code: 1,
          stderr: /Wrong number of positional arguments: 2/,
        },
      },
    ];

    fixtures.forEach(({ args, expected }) => {
      test(`run command with args "${args.join(" ")}"`, async () => {
        let code = 0;
        let stdout, stderr;

        try {
          const result = await execFilePromise("node", ["index.js", ...args]);
          stdout = result.stdout;
          stderr = result.stderr;
        } catch (e) {
          code = e.code;
          stdout = e.stdout;
          stderr = e.stderr;
        }

        if (expected.code !== undefined) {
          assert.equal(code, expected.code);
        }

        if (expected.stdout) {
          assert.match(stdout, expected.stdout);
        }

        if (expected.stderr) {
          assert.match(stderr, expected.stderr);
        }
      });
    });
  });
});
