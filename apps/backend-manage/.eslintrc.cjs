module.exports = {
  env: {
    browser: true, // 浏览器全局变量
    node: true, // Node.js全局变量和作用域
    commonjs: true, // 启用CommonJS模块规范
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // 禁用 ESLint 中与 Prettier 冲突的规则
  ],
  ignorePatterns: ["craco.config.js"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    jsx: true,
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off", // React17后不需要在jsx中主动引入react
    "@typescript-eslint/no-explicit-any": ["off"], // 关闭any类型时的警告
    "@typescript-eslint/no-empty-function": ["off"], // 关闭空函数警告
    "no-empty": ["warn"],
    "react/jsx-curly-brace-presence": [
      "error",
      {
        "props": "never",  // 强制字符串 props 不使用 {}
        "children": "never"  // 强制字符串 children 不使用 {}
      }
    ]
  },
};
