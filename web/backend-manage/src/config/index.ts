let username: string,
  password: string,
  domain: string,
  uploadUrl: string,
  publicPath: string,
  preViewUrl: string;

if (process.env.NODE_ENV === "development") {
  username = "admin";
  password = "admin";
  // domain = "http://locahost:30000";
  domain = "http://localhost:30200";
  uploadUrl = "http://192.168.1.18:10006";
  preViewUrl = "http://192.168.1.18:10006/onlinePreview/onlinePreview";
  publicPath = "/";
} else {
  username = "";
  password = "";
  domain = process.env.REACT_APP_DOMAIN || window.origin;
  uploadUrl = process.env.REACT_APP_UPLOAD_URL || window.origin;
  preViewUrl = process.env.REACT_APP_PREVIEW_URL || window.origin + "/onlinePreview/onlinePreview";
  publicPath = process.env.REACT_APP_PUBLIC_PATH || "/";
}
export {username, password, domain, uploadUrl, preViewUrl, publicPath};
