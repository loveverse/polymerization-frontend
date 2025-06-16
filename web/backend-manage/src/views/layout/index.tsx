import React, {useEffect, useMemo, useRef, useState} from "react";
import {Avatar, Button, Dropdown, Layout, Menu, message} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useLocation, useNavigate, useOutlet} from "react-router-dom";
import {CSSTransition, SwitchTransition} from "react-transition-group";

import {defaultDict, useAppContext} from "@/context";
import {reqLogOut} from "@/api/login";
import Logo from "@/assets/imgs/logo.png";
import {useRouteToMenuFn} from "@/router/hooks";
import styles from "./index.module.scss";
import UserCenterDrawer from "@/views/layout/components/UserCenterDrawer";
import CustomBreadcrumb from "@/views/layout/components/Breadcrumb";
import {useDrawerControls} from "@/hooks/useDrawerControls";
import userCenterDrawer from "@/views/layout/components/UserCenterDrawer";

const {Sider, Content, Header} = Layout;

const LayoutMain: React.FC = () => {
  const navigate = useNavigate();

  const {asyncRoutes, userInfo, actions} = useAppContext();
  const {pathname} = useLocation();
  const outletElement = useOutlet();
  const nodeRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const logout = async () => {
    const res = await reqLogOut();
    if (res.code === 200) {
      localStorage.removeItem("backend-token");
      localStorage.removeItem("userInfo")
      // 重新获取路由
      actions.resetAppContext();
      navigate("/login");
      message.success("退出登录成功");
    } else {
      message.error(res.msg);
    }
  };
  const [userCenterProps, userCenterActions] = useDrawerControls();


  const routeToMenuFn = useRouteToMenuFn();
  const menuList = useMemo(() => {
    return routeToMenuFn(asyncRoutes);
  }, [routeToMenuFn, asyncRoutes]);


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
        theme="dark"
        width={220}
        className="sider-menu">
        <div className="signboard-box">
          <img src={Logo} className="logo" alt=""/>
          {!collapsed ? <span className="title">后台管理</span> : null}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={menuList}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          className="sider-menus"
          onClick={({key}) => {
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
              icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
              onClick={() => setCollapsed(!collapsed)}></Button>
            <CustomBreadcrumb userMenu={asyncRoutes}/>
          </div>
          <Dropdown
            trigger={["hover"]}
            rootClassName={styles["dropdown-wrapper"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: "个人中心",
                  onClick: () => {
                    userCenterActions.show();
                  },
                },
                {type: "divider"},
                {
                  key: "2",
                  label: "退出登录",
                  danger: true,
                  onClick: logout,
                },
              ],
            }}>
            <Button type="text" className="user-info">
              <Avatar src={userInfo?.avatar} size={34} alt="avatar"/>
              <span className="username">{userInfo?.username}</span>
            </Button>
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
      <UserCenterDrawer drawerProps={userCenterProps} drawerActions={userCenterActions}/>
    </Layout>
  );
};
export default LayoutMain;
