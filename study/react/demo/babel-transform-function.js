import Babel from "@babel/core"
import * as fs from "node:fs"

/**
 * babel的三个主要步骤：解析，转换，生成
 * 解析步骤接收代码并输出AST，主要分为词法分析和语法分析
 * 词法分析阶段会把字符串形式的代码转换为令牌流，令牌是一个扁平的语法片段数组
 * 语法阶段
 *
 */

const file = fs.readFileSync("./test.js", "utf8")
const transformFunction = ({ types: t }) => {
  return {
    name: "babel-transform-function",
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node
        const arrowFunction = t.functionExpression(
          null, //node.id 是一个 Identifier 节点，表示函数名
          node.params, //node.params 是一个数组，表示函数的参数
          // BlockStatement 是 JavaScript 抽象语法树（AST）中的一种节点类型，表示一个由大括号 {} 包围的语句块。它是函数体、循环体、条件分支（如 if 语句）等代码块的基础结构
          t.blockStatement([t.returnStatement(node.body)]), //node.body 是函数的主体，通常是一个 BlockStatement 节点
          node.async, //node.async 是一个布尔值，表示函数是否是异步的 (async 函数)
        )
        path.replaceWith(arrowFunction)
      },
    },
  }
}

const result = Babel.transform(file, {
  plugins: [transformFunction],
})

console.log(result.code)
