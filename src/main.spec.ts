import * as tc from "@actions/tool-cache";
import { Inputs, getVersion, getToken, getBinDirName } from "./main";

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
      expect(getToken({ ...inputs, token: "" })).toBe(undefined);
      expect(getToken({ ...inputs, token: "xxxxx" })).toBe("xxxxx");
    });
  });
});

describe("getBinDirName", () => {
  const file: tc.IToolReleaseFile = {
    filename: "mkr_linux_amd64.tar.gz",
    platform: "linux",
    arch: "x64",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    download_url: "https://example.com/archive.tar.gz",
  };

  it("returns file name excluding file extension", () => {
    expect(getBinDirName({ ...file, filename: "mkr_linux_amd64.tar.gz" })).toBe("mkr_linux_amd64");
    expect(getBinDirName({ ...file, filename: "mkr_darwin_amd64.zip" })).toBe("mkr_darwin_amd64");
  });
});
