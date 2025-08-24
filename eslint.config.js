import typescriptEslint from "typescript-eslint"
import eslint from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import importX from "eslint-plugin-import-x"
import { builtinModules } from "node:module"

// https://github.com/vuejs/core/blob/main/eslint.config.js#L20
// 基础共享配置
const baseConfig = {
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.nuxt/**",
    "**/.output/**",
    "**/.next/**",
    "**/.turbo/**",
    "**/pnpm-lock.yaml",
    "**/.env*",
  ],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      NodeJS: "readonly",
      console: "readonly",
      process: "readonly",
    },
  },
  rules: {
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "no-debugger": "warn",
    "no-unused-vars": "off", // 交由 TS 处理
  },
}

// TypeScript 配置
const typescriptConfig = {
  files: ["**/*.{ts,tsx,vue}"],
  plugins: {
    "@typescript-eslint": typescriptEslint.plugin,
  },
  languageOptions: {
    parser: typescriptEslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd(),
      extraFileExtensions: [".vue"],
    },
  },
  rules: {
    ...typescriptEslint.configs.recommended[0].rules,
    ...typescriptEslint.configs.stylistic[0].rules,
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": ["warn"],
  },
}

// JavaScript 配置
const javascriptConfig = {
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    ...eslint.configs.recommended.rules,
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
  },
}

// import-x 配置
const importConfig = {
  files: ["**/*.{js,jsx,ts,tsx,vue}"],
  plugins: { "import-x": importX },
  rules: {
    // ...importX.configs.recommended.rules,
    ...importX.configs.typescript.rules,
    "import-x/no-nodejs-modules": ["error", { allow: builtinModules.map(m => `node:${m}`) }],
  },
}

// Vue 配置
const getVueConfig = async () => {
  const vuePlugin = await import("eslint-plugin-vue")
  // 导入 Vue 专用解析器
  const vueParser = await import("vue-eslint-parser")
  return {
    files: ["packages/web-blog/**/*.{vue,ts,tsx,js,jsx}"],
    plugins: { vue: vuePlugin.default, "@typescript-eslint": typescriptEslint.plugin },
    languageOptions: {
      parser: vueParser.default,
      parserOptions: {
        // 为 script 部分指定 TypeScript 解析器
        parser: {
          ts: typescriptEslint.parser,
          tsx: typescriptEslint.parser,
          js: "espree",
          jsx: "espree",
        },
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
      },
    },
    processor: vuePlugin.default.processors[".vue"],
    rules: {
      ...vuePlugin.default.configs["flat/essential"].rules,
      ...vuePlugin.default.configs["flat/recommended"].rules,
      "vue/script-indent": ["error", 2, { baseIndent: 0, switchCase: 1 }],
      "vue/html-indent": ["error", 2],
      "vue/multi-word-component-names": ["warn", { ignores: ["index"] }],
      "@typescript-eslint/no-explicit-any": ["warn"],
    },
  }
}

// React 配置
const getReactConfig = async () => {
  const reactPlugin = await import("eslint-plugin-react")
  return {
    files: ["packages/*react*/**/*.{tsx,jsx,ts,js}"],
    plugins: { react: reactPlugin.default },
    languageOptions: {
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      ...reactPlugin.default.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  }
}

// Node 配置
const nodeConfig = {
  files: ["packages/*node*/**/*.{ts,js}"],
  languageOptions: {
    globals: {
      __dirname: "readonly",
      __filename: "readonly",
    },
  },
  rules: {
    "import-x/no-nodejs-modules": "off",
    "no-console": "off",
  },
}

const config = [
  baseConfig,
  javascriptConfig,
  typescriptConfig,
  importConfig,
  await getVueConfig(),
  await getReactConfig(),
  nodeConfig,
  prettierConfig,
]

export default config
