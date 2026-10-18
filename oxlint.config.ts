import { config } from "@susisu/oxlint-config";

export default config({
  options: {
    typeAware: true,
    reportUnusedDisableDirectives: "warn",
  },
  categories: {
    correctness: "error",
  },
  ignorePatterns: ["dist/**/*"],
  rules: {
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-array-method-this-argument": "off",
  },
});
