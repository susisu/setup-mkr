import { normalizeVersion } from "./version";

describe("normalizeVersion", () => {
  it.each([
    ["1.2.3", "1.2.3"],
    ["v1.2.3", "1.2.3"],
  ])("normalizes version format (%s => %s)", (input, output) => {
    expect(normalizeVersion(input)).toBe(output);
  });

  it("fails if version format is unsuported", () => {
    expect(() => {
      normalizeVersion("alpha");
    }).toThrowError("Unsupported version format: alpha");
  });
});
