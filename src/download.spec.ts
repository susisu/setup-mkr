import { createDownloadSpec, createDownloadUrl } from "./download";

describe("createDownloadSpec", () => {
  it("creates download spec", () => {
    const spec = createDownloadSpec({ version: "1.2.3", platform: "linux", arch: "x64" });
    expect(spec).toEqual({ version: "1.2.3", platform: "linux", arch: "amd64" });
  });

  it.each([
    ["linux", "linux"],
    ["darwin", "darwin"],
  ] as const)("normalizes platform (%s => %s)", (input, output) => {
    const spec = createDownloadSpec({ version: "1.2.3", platform: input, arch: "x64" });
    expect(spec.platform).toBe(output);
  });

  it("fails if platform is unsuported", () => {
    expect(() => {
      createDownloadSpec({ version: "1.2.3", platform: "android", arch: "x64" });
    }).toThrowError("Unsupported platform: android");
  });

  it.each([
    ["arm", "arm"],
    ["arm64", "arm64"],
    ["ia32", "386"],
    ["x64", "amd64"],
  ] as const)("normalizes arch (%s => %s)", (input, output) => {
    const spec = createDownloadSpec({ version: "1.2.3", platform: "linux", arch: input });
    expect(spec.arch).toBe(output);
  });

  it("fails if arch is unsuported", () => {
    expect(() => {
      createDownloadSpec({ version: "1.2.3", platform: "linux", arch: "ppc" });
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
  ] as const)("creates download url from a download spec (%p)", (input, output) => {
    expect(createDownloadUrl(input)).toBe(output);
  });
});
