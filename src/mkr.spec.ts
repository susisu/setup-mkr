import { createSpec, createDownloadUrl } from "./mkr";

describe("createSpec", () => {
  it("creates a spec", () => {
    const spec = createSpec({ version: "1.2.3", platform: "linux", arch: "x64" });
    expect(spec).toEqual({ version: "1.2.3", platform: "linux", arch: "amd64" });
  });

  it.each([
    ["1.2.3", "1.2.3"],
    ["v1.2.3", "1.2.3"],
    ["", "latest"],
    ["latest", "latest"],
  ])("normalizes version format (%s => %s)", (input, output) => {
    const spec = createSpec({ version: input, platform: "linux", arch: "x64" });
    expect(spec).toEqual({ version: output, platform: "linux", arch: "amd64" });
  });

  it("fails if version format is unsuported", () => {
    expect(() => {
      createSpec({ version: "alpha", platform: "linux", arch: "x64" });
    }).toThrowError("Unsupported version format: alpha");
  });

  it.each([
    ["linux", "linux"],
    ["darwin", "darwin"],
  ] as const)("normalizes platform (%s => %s)", (input, output) => {
    const spec = createSpec({ version: "1.2.3", platform: input, arch: "x64" });
    expect(spec.platform).toBe(output);
  });

  it("fails if platform is unsuported", () => {
    expect(() => {
      createSpec({ version: "1.2.3", platform: "android", arch: "x64" });
    }).toThrowError("Unsupported platform: android");
  });

  it.each([
    ["arm", "arm"],
    ["arm64", "arm64"],
    ["ia32", "386"],
    ["x64", "amd64"],
  ] as const)("normalizes arch (%s => %s)", (input, output) => {
    const spec = createSpec({ version: "1.2.3", platform: "linux", arch: input });
    expect(spec.arch).toBe(output);
  });

  it("fails if arch is unsuported", () => {
    expect(() => {
      createSpec({ version: "1.2.3", platform: "linux", arch: "ppc" });
    }).toThrowError("Unsupported arch: ppc");
  });
});

describe("createDownloadUrl", () => {
  it.each([
    [
      { version: "1.2.3", platform: "linux", arch: "amd64" },
      "https://github.com/mackerelio/mkr/releases/download/v1.2.3/mkr_linux_amd64.tar.gz",
    ],
    [
      { version: "1.2.3", platform: "darwin", arch: "amd64" },
      "https://github.com/mackerelio/mkr/releases/download/v1.2.3/mkr_darwin_amd64.zip",
    ],
    [
      { version: "latest", platform: "linux", arch: "amd64" },
      "https://github.com/mackerelio/mkr/releases/latest/download/mkr_linux_amd64.tar.gz",
    ],
  ] as const)("creates a download url from a spec (%p)", (input, output) => {
    expect(createDownloadUrl(input)).toBe(output);
  });
});
