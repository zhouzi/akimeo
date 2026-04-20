import { expect } from "vitest";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Matchers<T = any, R = unknown> {
    toBeApproximatelyEqual(expected: number, tolerance?: number): R;
  }
}

expect.extend({
  toBeApproximatelyEqual(received: number, expected: number, tolerance = 1) {
    return {
      pass: Math.abs(received - expected) <= tolerance,
      message: () =>
        `expected ${received} to ${this.isNot ? "not " : ""}be approximately equal to ${expected} (±${tolerance})`,
    };
  },
});
