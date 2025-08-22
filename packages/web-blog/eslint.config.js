// import rootConfig from "../../eslint.config.js"
//
// import vue from "eslint-plugin-vue"
// import vueParser from "vue-eslint-parser"
//
// export default [
//   // 继承根目录配置
//   ...rootConfig,
//
//   // Vue 项目专属配置
//   {
//     // 指定生效范围（仅 Vue 相关文件）
//     files: ["**/*.vue", "**/*.jsx", "**/*.tsx"],
//
//     // 配置 Vue 解析器
//     languageOptions: {
//       parser: vueParser, // 核心：指定 Vue 解析器
//       parserOptions: {
//         // 若使用 TypeScript，需配置 TS 解析器
//         parser: "@typescript-eslint/parser", // 可选，需安装 @typescript-eslint/parser
//         ecmaVersion: "latest",
//         sourceType: "module",
//       },
//     },
//
//     // 启用 Vue 插件
//     plugins: {
//       vue,
//     },
//
//     // 继承 Vue 推荐规则
//     rules: {
//       // 启用 eslint-plugin-vue 的推荐规则
//       ...vue.configs["flat/essential"].rules,
//       ...vue.configs["flat/recommended"].rules,
//       // "vue/script-indent": ["error", 2, {
//       //   "baseIndent": 0, // 脚本内部基础缩进为 0（顶格）
//       //   "switchCase": 1
//       // }]
//       // 子模块自定义 Vue 规则（覆盖默认）
//       // "vue/multi-word-component-names": "off", // 示例：关闭组件名多单词校验
//       // "vue/script-setup-uses-vars": "error", // 确保 script-setup 中变量被使用
//       // "vue/no-unknown-directive": "off",
//       // "no-console": "error",
//     },
//   },
// ]
