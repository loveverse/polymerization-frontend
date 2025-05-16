const path = require("path");

if(process.env.NODE_ENV === "development"){
  console.info(process.env)
}
module.exports = {
  devServer: {
    port: 40200,
  },
  style: {
    sass: {
      loaderOptions: {
        additionalData: `@import "@/assets/css/global.scss";`,
      },
    },
  },
  webpack: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
    configure: (webpackConfig, { env }) => {
      webpackConfig.devtool = env === "development" ? "source-map" : false;
      // 设置静态资源公共路径
      webpackConfig.output = {
        path: path.resolve(__dirname, "build"), // 打包后的路径名
        publicPath: process.env.REACT_APP_PUBLIC_PATH,
        // 这里预设为hash,contenthash根据内容生成
        // filename: "static/js/[name].[contenthash].js", // 只会处理js文件
        // chunkFilename: "",
        // clean: {
        // keep: /public\//,
        // }, // 在生成文件之前清空 output 目录
      };
      // 拆包
      if (env !== "development") {
        webpackConfig.optimization = {
          moduleIds: "deterministic", // 添加新的依赖时，保持vendor的哈希值一致
          runtimeChunk: "single", // 提取引导模板(为所有 chunk 创建一个 runtime bundle)
          // 将第三方库提取到单独的vendor chunk中
          splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
              },
            },
          },
        };
      }
      webpackConfig.module.rules[1].oneOf = [
        ...[
          {
            test: /.svg$/,
            // 存放svg的文件夹
            include: path.resolve(__dirname, "./src/assets/svgs"),
            use: [
              {
                loader: "babel-loader",
              },
              {
                loader: "@svgr/webpack",
                options: {
                  babel: false,
                  icon: true,
                },
              },
              {
                loader: "svgo-loader",
                options: {
                  plugins: [{ name: "removeAttrs", params: { attrs: "fill" } }],
                },
              },
            ],
          },
        ],
        ...webpackConfig.module.rules[1].oneOf,
      ];
      return webpackConfig;
    },
  },
};
