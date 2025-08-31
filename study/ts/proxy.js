const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()

app.use(
  "/desktop",
  createProxyMiddleware({
    target: "http://localhost:9000",
    changeOrigin: true,
    pathRewrite: {
      "^/desktop": "/desktop", // 如果路径相同可以不用改
    },
  }),
)

app.listen(8005, () => {
  console.log("Proxy server running at http://localhost:8005")
})
