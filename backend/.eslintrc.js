module.exports = {
  env: {
    node: true,
    es6: true,
    commonjs: true,
    mocha: true,
    browser: false,
    jest: true,
    "jest/globals": true,
  },
  plugins: ["jest", "prettier"],
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {},
};
