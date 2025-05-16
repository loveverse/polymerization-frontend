import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import "dayjs/locale/zh-cn";
import BeforeRouterEnter from "@/router/beforeRouterEnter";


function App() {
  
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#3187FF",
        },
      }}>
      <BeforeRouterEnter />
    </ConfigProvider>
  );
}
export default App;
