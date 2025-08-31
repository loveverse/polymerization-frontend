import * as Babel from "@babel/core"
import presetEnv from "@babel/preset-env"
import react from "@babel/preset-react"

import * as fs from "node:fs"

const file = fs.readFileSync("./test.jsx", "utf8")
const result = Babel.transform(file, {
  presets: [[presetEnv, { useBuiltIns: "usage" }], react],
})
fs.writeFile("./test-transform.js", result.code, err => {
  if (err) throw err
})

console.log(result.code)
