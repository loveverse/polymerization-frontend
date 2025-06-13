import { Button, Result, Space } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotAuth() {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="对不起，您没有权限访问此页面。"
      extra={
        <Space size={30}>
          <Button
            type="primary"
            onClick={() => {
              // 会写入浏览器历史；window.replace会进行替换，不会写进历史，跳转后，返回键无法点击
              window.location.hash = "/home";
            }}>
            返回首页
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate(-1);
            }}>
            返回上一页
          </Button>
        </Space>
      }
    />
  );
}
