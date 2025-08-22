// 引入必要的插件和配置
import typescriptEslint from "typescript-eslint"
import eslint from "@eslint/js"
import prettierConfig from "eslint-config-prettier"

export default typescriptEslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  },
  // React项目专属配置
  // {
  //   files: ["packages/web-admin/**/*.{js,jsx,ts,tsx}"], // 仅匹配React子模块
  //   extends: [
  //     "plugin:react/recommended",
  //     "plugin:react-hooks/recommended",
  //     "plugin:@typescript-eslint/recommended"
  //   ],
  //   rules: {
  //     "react/prop-types": "off",
  //     "react/react-in-jsx-scope": "off"
  //   },
  //   settings: {
  //     react: {version: "detect"}
  //   }
  // },
  // Vue项目专属配置
  {
    files: ["packages/web-blog/**/*.{vue,js,ts}"], // 仅匹配Vue子模块
    extends: [eslint.configs.recommended, ...typescriptEslint.configs.recommended, prettierConfig],
    languageOptions: {
      // resolvePluginsRelativeTo: new URL("../packages/web-blog/node_modules", import.meta.url)
      //   .pathname,
      // parser: "vue-eslint-parser",
      parserOptions: {
        parser: typescriptEslint.parser, // 处理Vue中的TS
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "vue/script-indent": ["error", 2, {
        "baseIndent": 0,  // 关键配置：script内第一行顶格
        "switchCase": 1,
        "ignores": []
      }],
      "object-curly-spacing": ["error", "always"],
      "no-console": "warn",
    },
  },
)
