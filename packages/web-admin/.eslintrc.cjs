module.exports = {
  root: true, // 不再向上查找
  env: {
    browser: true, // 浏览器全局变量
    node: true, // Node.js全局变量和作用域
    commonjs: true, // 启用CommonJS模块规范
    es2021: true,
  },
  extends: [
    // "react-app",
    // "react-app/jest",
    "eslint:recommended",
    "plugin:react/recommended",
    // "plugin:react/jsx-runtime", // 支持React 17+的自动导入
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier", // 禁用 ESLint 中与 Prettier 冲突的规则
  ],
  ignorePatterns: ["craco.config.js", "babel.config.js"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // 明确指定TypeScript文件
      parser: "@typescript-eslint/parser",
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    jsx: true,
    project: "./tsconfig.json", // 关联你的tsconfig
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off", // React17后不需要在jsx中主动引入react
    "@typescript-eslint/no-explicit-any": ["warn"], // 关闭any类型时的警告
    "@typescript-eslint/no-empty-function": ["off"], // 关闭空函数警告
    "no-empty": ["warn"],
    "react/jsx-curly-brace-presence": [
      "error",
      {
        props: "never", // 强制字符串 props 不使用 {}
        children: "never", // 强制字符串 children 不使用 {}
      },
    ],
    // 禁用Prettier的换行符检查
    "prettier/prettier": [
      "error",
      // {
      //   endOfLine: "auto", // 自动适应系统的换行符风格
      // },
    ],
  },
}
