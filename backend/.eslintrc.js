module.exports = {
  env: {
    node: true,
    es6: true,
    commonjs: true,
    mocha: true,
    browser: false,
  },
  extends: ["eslint:recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "no-prototype-builtins": "off",
    "no-extra-boolean-cast": "off",
  },
};
