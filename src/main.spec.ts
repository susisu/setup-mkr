import { describe, it, expect } from "vitest";
import type * as tc from "@actions/tool-cache";
import type { Inputs } from "./main";
import { getVersion, getToken, getAuth, getReleaseFile, getBinDirName } from "./main";

describe("inputs", () => {
  const inputs: Inputs = {
    version: "v1.2.3",
    token: "xxxxx",
  };

  describe("getVersion", () => {
    it("gets version from inputs", () => {
      expect(getVersion({ ...inputs, version: "" })).toBe("<1.0.0");
      expect(getVersion({ ...inputs, version: "latest" })).toBe("<1.0.0");
      expect(getVersion({ ...inputs, version: "1.2.3" })).toBe("1.2.3");
      expect(getVersion({ ...inputs, version: "v1.2.3" })).toBe("v1.2.3");
    });
  });

  describe("getToken", () => {
    it("gets token from inputs", () => {
      expect(getToken({ ...inputs, token: "" })).toBeUndefined();
      expect(getToken({ ...inputs, token: "xxxxx" })).toBe("xxxxx");
    });
  });
});

describe("getAuth", () => {
  it("returns authorization header", () => {
    expect(getAuth("xxxxx")).toBe("token xxxxx");
  });
});

describe("getReleaseFile", () => {
  it("returns the first file in the release", () => {
    const release: tc.IToolRelease = {
      version: "1.2.3",
      stable: true,
      release_url: "https://github.com/mackerelio/mkr/releases/tag/v1.2.3",
      files: [
        {
          filename: "a.tar.gz",
          platform: "linux",
          arch: "x64",
          download_url: "https://github.com/mackerelio/mkr/releases/download/v1.2.3/a.tar.gz",
        },
        {
          filename: "b.tar.gz",
          platform: "linux",
          arch: "x64",
          download_url: "https://github.com/mackerelio/mkr/releases/download/v1.2.3/b.tar.gz",
        },
      ],
    };
    expect(getReleaseFile(release)).toEqual({
      filename: "a.tar.gz",
      platform: "linux",
      arch: "x64",
      download_url: "https://github.com/mackerelio/mkr/releases/download/v1.2.3/a.tar.gz",
    });
  });

  it("throws if the release has no files", () => {
    const release: tc.IToolRelease = {
      version: "1.2.3",
      stable: true,
      release_url: "https://github.com/mackerelio/mkr/releases/tag/v1.2.3",
      files: [],
    };
    expect(() => {
      getReleaseFile(release);
    }).toThrowError("File not found in the release");
  });

  it("throws if the download URL is unknown i.e. does not start with https://github.com/mackerelio/mkr/releases/download/", () => {
    const release: tc.IToolRelease = {
      version: "1.2.3",
      stable: true,
      release_url: "https://github.com/mackerelio/mkr/releases/tag/v1.2.3",
      files: [
        {
          filename: "mkr_linux_amd64.tar.gz",
          platform: "linux",
          arch: "x64",
          download_url: "https://example.com/archive.tar.gz",
        },
      ],
    };
    expect(() => {
      getReleaseFile(release);
    }).toThrowError("Unknown download URL 'https://example.com/archive.tar.gz'");
  });
});

describe("getBinDirName", () => {
  const file: tc.IToolReleaseFile = {
    filename: "mkr_linux_amd64.tar.gz",
    platform: "linux",
    arch: "x64",
    download_url: "https://github.com/mackerelio/mkr/releases/download/v1.2.3/archive.tar.gz",
  };

  it("returns file name excluding file extension", () => {
    expect(getBinDirName({ ...file, filename: "mkr_linux_amd64.tar.gz" })).toBe("mkr_linux_amd64");
    expect(getBinDirName({ ...file, filename: "mkr_darwin_amd64.zip" })).toBe("mkr_darwin_amd64");
  });
});
