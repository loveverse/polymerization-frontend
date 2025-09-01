// https://www.prettier.cn/docs/configuration.html
export default {
  // 语句末尾是否添加分号（false 表示不添加）
  semi: false,
  // 字符串是否使用单引号包裹（false 表示使用双引号）
  singleQuote: false,
  // 缩进宽度（2 表示使用 2 个空格）
  tabWidth: 2,
  // 单行最大字符数（超过该值会自动换行）
  printWidth: 100,
  // 标签闭合括号是否与内容在同一行（true 表示同一行）
  bracketSameLine: true,
  // 箭头函数参数是否始终使用括号（'always' 表示总是添加括号）
  arrowParens: "avoid",
  // JSX 中是否使用单引号（false 表示使用双引号）
  jsxSingleQuote: false,
  // 对象字面量括号间是否添加空格（true 表示添加）
  bracketSpacing: true,
  // Vue 组件中 script 和 style 是否跟随外部缩进（true 表示跟随）
  vueIndentScriptAndStyle: false,
  // git 提交时会自动转换 crlf 和 lf，prettier2.x以上默认 lf
  // endOfLine: "lf",
}
