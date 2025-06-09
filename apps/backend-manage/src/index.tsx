import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "normalize.css";
import "@/assets/css/base.scss";
import zhCN from "antd/lib/locale/zh_CN";
import {ConfigProvider, App as AntdApp} from "antd";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  // <React.StrictMode>
  <HashRouter future={{v7_relativeSplatPath: true, v7_startTransition: true}}>
    <AntdApp style={{height: "inherit"}}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#3187FF",
          },
        }}>
        <App/>
      </ConfigProvider>
    </AntdApp>
  </HashRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
