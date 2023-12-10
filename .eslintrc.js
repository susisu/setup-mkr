"use strict";

module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "@susisu/eslint-config/preset/ts",
        "prettier",
        "plugin:eslint-comments/recommended",
      ],
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
      rules: {
        "eslint-comments/no-unused-disable": "error",
      },
    },
    {
      files: ["*.spec.ts", "src/**/__tests__/**/*.ts"],
      extends: ["plugin:vitest/recommended"],
    },
    {
      files: ["*.js"],
      extends: [
        "@susisu/eslint-config/preset/js",
        "prettier",
        "plugin:eslint-comments/recommended",
      ],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
      rules: {
        "eslint-comments/no-unused-disable": "error",
      },
    },
  ],
};
