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
});
