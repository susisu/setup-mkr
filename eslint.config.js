import { config } from "@susisu/eslint-config";
import vitestPlugin from "@vitest/eslint-plugin";
import globals from "globals";

export default config(
  {
    tsconfigRootDir: import.meta.dirname,
  },
  [
    {
      plugins: {
        vitest: vitestPlugin,
      },
    },
    {
      files: ["src/**/*.ts"],
      languageOptions: {
        globals: {
          ...globals.es2023,
          ...globals.node,
        },
      },
    },
    {
      files: ["src/**/*.spec.ts"],
      rules: {
        ...vitestPlugin.configs.recommended.rules,
      },
    },
    {
      files: ["*.js"],
      languageOptions: {
        globals: {
          ...globals.es2023,
          ...globals.node,
        },
      },
    },
  ],
);
