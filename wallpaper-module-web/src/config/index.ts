let username: string, password: string, publicPath: string, domain: string, uploadUrl: string,
  previewUrl: string;
// 开发环境为了修改请求地址，不读配置，不然需要多次重启
console.log("[ import. ] >", import.meta.env);
if (import.meta.env.DEV) {
  username = "";
  password = "";
  publicPath = "/"
  domain = "http://localhost:30000";
  uploadUrl = ""
  previewUrl = "";
} else {
  // 线上环境（打包后的请求地址和部署的服务器一致，可以省略配置）
  publicPath = import.meta.env.VITE_PUBLIC_PATH
  domain = import.meta.env.VITE_DOMAIN || window.origin;
  uploadUrl = import.meta.env.VITE_PUBLIC_PATH || window.origin
  previewUrl = import.meta.env.VITE_PREVIEW_URL || window.origin
}

export {username, password, publicPath, domain, uploadUrl, previewUrl};
