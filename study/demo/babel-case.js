import Babel from '@babel/core'
import fs from 'node:fs'
const file = fs.readFileSync('./test.js', 'utf8')
//babel会注入一个types对象里面包含了各种ast节点的方法
const transformFunction = ({ types: t }) => {
  return {
    name: 'babel-transform-function',
    //visitor 是一个对象，它包含了一组方法，这些方法对应于 AST 中的不同节点类型。每当 Babel 遇到某种类型的节点时，都会调用 visitor 中对应的方法。
    visitor: {
      //匹配 箭头函数 当然也可以匹配别的东西 这儿只是案例
      ArrowFunctionExpression(path) {
        const node = path.node
        const arrowFunction = t.functionExpression(
          null, //node.id 是一个 Identifier 节点，表示函数名
          node.params, //node.params 是一个数组，表示函数的参数
          // BlockStatement 是 JavaScript 抽象语法树（AST）中的一种节点类型，表示一个由大括号 {} 包围的语句块。它是函数体、循环体、条件分支（如 if 语句）等代码块的基础结构
          t.blockStatement([t.returnStatement(node.body)]),  //node.body 是函数的主体，通常是一个 BlockStatement 节点
          node.async //node.async 是一个布尔值，表示函数是否是异步的 (async 函数)
        )
        path.replaceWith(arrowFunction) //替换当前节点
      }
    }
  }
}
const result = Babel.transform(file, {
  plugins: [
    transformFunction
  ]
})
console.log(result.code)
