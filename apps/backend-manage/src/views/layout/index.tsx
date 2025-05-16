import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Menu, Button, Dropdown, message, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, useOutlet } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { defaultDicts, useAppContext } from "@/context";
import { reqLogOut } from "@/api/login";
import Logo from "@/assets/imgs/logo.png";
import { useRouteToMenuFn } from "@/router/hooks";
import CustomBreadcrumb from "./Breadcrumb";
import styles from "./index.module.scss";

const { Sider, Content, Header } = Layout;

const LayoutMain: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, permissionRoutes, setDicts } = useAppContext();
  const { pathname } = useLocation();
  const outletElement = useOutlet();
  const nodeRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const logOut = async () => {
    const res = await reqLogOut();
    if (res.code === 200) {
      localStorage.removeItem("backend-token");
      // 重新获取路由
      setDicts(defaultDicts);
      navigate("/login");
      message.success("退出登录成功");
    } else {
      message.error(res.message);
    }
  };
  const routeToMenuFn = useRouteToMenuFn();
  const menuList = useMemo(() => {
    return routeToMenuFn(permissionRoutes);
  }, [routeToMenuFn, permissionRoutes]);

  // 刷新页面菜单保持高亮
  useEffect(() => {
    // ?<=: 正向后瞻断言,向/的后方看
    // const keys = pathname.split(/(?<=\/[^/]+)\//);
    const regex = /^(\/[^\\/]+)(\/[^\\/]+)?/;
    const matches = regex.exec(pathname);
    if (matches) {
      const keys = [matches[0], matches[1]];
      setSelectedKeys(keys);
      const mergeOpenKeys = openKeys.length ? openKeys.concat(keys[1]) : [keys[1]];
      setOpenKeys(mergeOpenKeys);
    }
  }, [pathname]);
  return (
    <Layout className={styles.root}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={220}
        className="sider-menu">
        <div className="signboard-box">
          <img src={Logo} className="logo" alt="" />
          {!collapsed ? <span className="title">具身课程管理端</span> : null}
        </div>
        <Menu
          mode="inline"
          items={menuList}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          className="sider-menus"
          onClick={({ key }) => {
            navigate(key);
          }}
          onOpenChange={(openKeys) => {
            setOpenKeys(openKeys);
          }}
        />
      </Sider>
      <Layout className="layout-main-box">
        <Header className="layout-header-box">
          <div className="breadcrumb-box">
            <Button
              className="fold-box"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}></Button>
            <CustomBreadcrumb userMenu={permissionRoutes} />
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "个人中心",
                  onClick: () => {
                    navigate("/system/profile");
                  },
                },
                { type: "divider" },
                {
                  key: "2",
                  label: "退出登录",
                  danger: true,
                  onClick: logOut,
                },
              ],
            }}>
            <div className="user-info">
              <Avatar src={userInfo?.headImg} size={44} alt="avatar" />
              <span className="username">{userInfo?.name}</span>
            </div>
          </Dropdown>
        </Header>

        <Content className="layout-content-box">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={pathname}
              nodeRef={nodeRef}
              appear={true}
              timeout={300}
              classNames="fade"
              unmountOnExit>
              <div ref={nodeRef} className="node-animate">
                {outletElement}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutMain;
