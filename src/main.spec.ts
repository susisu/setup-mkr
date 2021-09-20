import { Inputs, getVersion, getToken } from "./main";

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
    expect(getToken({ ...inputs, version: "xxxxx" })).toBe("xxxxx");
  });
});
