"use strict";

module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      extends: ["@susisu/eslint-config/preset/ts", "prettier"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      env: {
        es6: true,
        node: true,
      },
      globals: {
        NodeJS: true,
      },
    },
    {
      files: ["*.spec.ts", "src/**/__tests__/**/*.ts"],
      extends: ["plugin:vitest/recommended"],
    },
    {
      files: ["*.js"],
      extends: ["@susisu/eslint-config/preset/js", "prettier"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
    },
  ],
};
