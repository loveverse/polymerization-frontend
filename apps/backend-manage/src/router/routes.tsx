import Login from "@/views/login";

/* 首页 */
import Home from "@/views/home";
/* 学校管理 */
import SchoolManage from "@/views/school";
/* 课程管理 */
import SubjectSetting from "@/views/course/subjectSetting";
import CourseManage from "@/views/course/courseManage";
import CourseTextbook from "@/views/course/courseManage/textbook";

/* 资源管理 */
import CoursewareManage from "@/views/resource/courseware/index";
import QuestionManage from "@/views/resource/question/index";

import Experiment from "@/views/experiment";

// AI模型

import ModelTagList from "@/views/aiModel";

import UserManage from "@/views/user";
/* 系统设置 */
import Profile from "@/views/system/profile";
import SystemDict from "@/views/system/dict";
import RoleManage from "@/views/system/role";
import MenuManage from "@/views/system/menu";

import { Result } from "antd";

import { NotAuth, NotFound, ServerError } from "@/components";
import CreateExperiment from "@/views/aiModel/createExperiment";
import ViewExperiment from "@/views/aiModel/viewExperiment";

import { Navigate, Outlet } from "react-router-dom";
import { AppRouteObject } from ".";
import ViewExperimentContent from "@/views/experiment/viewExperimentContent";
import SetScore from "@/views/experiment/setScore";
import TargetDefault from "@/views/target";
import TargetDetail from "@/views/target/targetDetail";

import ServerDevice from "@/views/serverDevice";
import Appraisal from "@/views/system/appraisal";

const Empty = <Result style={{ verticalAlign: "middle" }} title="正在开发中..." />;

// 动态路由
export const asyncRoutes: AppRouteObject[] = [
  {
    path: "/school",
    element: <SchoolManage />,
    meta: { label: "学校管理", icon: "school" },
  },
  {
    path: "/course",
    element: <Outlet />,
    meta: { label: "课程管理", icon: "course" },
    children: [
      {
        index: true,
        element: <Navigate to="/course/subjectSetting" replace />,
      },
      {
        path: "/course/subjectSetting",
        element: <SubjectSetting />,
        meta: { label: "学科设置" },
      },
      {
        path: "/course/courseManage",
        element: <CourseManage />,
        meta: { label: "课程设置" },
      },
      {
        path: "/course/courseManage/textbook",
        element: <CourseTextbook />,
        meta: { hideMenu: true, label: "课程详情", permission: true },
      },
    ],
  },
  {
    path: "/resource",
    element: <Outlet />,
    meta: { label: "资源管理", icon: "resource" },
    children: [
      { index: true, element: <Navigate to="/resource/courseware" replace /> },
      {
        path: "/resource/courseware",
        element: <CoursewareManage />,
        meta: { label: "课件资源" },
      },
      {
        path: "/resource/question",
        element: <QuestionManage />,
        meta: { label: "题库资源" },
      },
    ],
  },
  {
    path: "/target",
    element: <Outlet />,
    meta: { label: "指标管理", icon: "target" },
    children: [
      { index: true, element: <Navigate to="/target/default" replace /> },
      {
        path: "/target/default",
        element: <TargetDefault />,
        meta: { label: "指标管理", hideMenu: true, permission: true },
      },
      {
        path: "/target/detail",
        element: <TargetDetail />,
        meta: { label: "指标详情", hideMenu: true },
      },
    ],
  },
  {
    path: "/experiment",
    element: <Outlet />,
    meta: { label: "实验", icon: "experiment" },
    children: [
      {
        index: true,
        element: <Navigate to="/experiment/default" replace />,
      },
      {
        path: "/experiment/default",
        element: <Experiment />,
        meta: { hideMenu: true, permission: true },
      },
      {
        path: "/experiment/content",
        element: <ViewExperimentContent />,
        meta: { hideMenu: true, label: "实验详情" },
      },
      {
        path: "/experiment/setScore",
        element: <SetScore />,
        meta: { hideMenu: true, label: "设置分值" },
      },
    ],
  },
  {
    path: "/aiModel",
    element: <Outlet />,
    meta: { label: "AI模型管理", icon: "aiModel" },
    children: [
      {
        index: true,
        element: <Navigate to="/aiModel/default" replace />,
      },
      {
        path: "/aiModel/default",
        element: <ModelTagList />,
        meta: { hideMenu: true, permission: true },
      },
      {
        path: "/aiModel/createExperiment",
        element: <CreateExperiment />,
        meta: { hideMenu: true, permission: true },
      },
      {
        path: "/aiModel/seeExperiment",
        element: <ViewExperiment />,
        meta: { hideMenu: true, permission: true },
      },
    ],
  },
  {
    path: "/report",
    element: <Outlet />,
    meta: { label: "报告管理", disabled: true, icon: "report" },
    children: [
      { index: true, element: <Navigate to="/report/template" replace /> },
      {
        path: "/report/template",
        element: Empty,
        meta: { label: "报告模板管理" },
      },
      {
        path: "/report/evaluteTemplate",
        element: Empty,
        meta: { label: "评价模板" },
      },
    ],
  },
  {
    path: "/serverDevice",
    element: <ServerDevice />,
    meta: { label: "服务器与设备管理", icon: "serverDevice" },
  },
  {
    path: "/user",
    element: <UserManage />,
    meta: { label: "用户管理", icon: "user" },
  },
  {
    path: "/system",
    element: <Outlet />,
    meta: { label: "系统设置", icon: "system" },
    children: [
      {
        index: true,
        element: <Navigate to="/system/role" replace />,
      },
      // 不需要做权限的路由
      {
        path: "/system/profile",
        element: <Profile />,
        meta: { label: "个人中心", hideMenu: true, permission: true },
      },
      {
        path: "/system/appraisal",
        element: <Appraisal />,
        meta: { label: "测评管理" },
      },
      {
        path: "/system/role",
        element: <RoleManage />,
        meta: { label: "角色管理" },
      },
      {
        path: "/system/menu",
        element: <MenuManage />,
        meta: { label: "菜单管理" },
      },
      {
        path: "/system/dict",
        element: <SystemDict />,
        meta: { label: "字典管理" },
      },
    ],
  },
];

export const loginRoute: AppRouteObject = {
  path: "/login",
  element: <Login />,
};
// 不存在路由菜单时，默认显示
export const staticRoutes: AppRouteObject[] = [
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <Home />,
    meta: { label: "首页", permission: true, icon: "home" },
  },
];
export const errorRoutes: AppRouteObject[] = [
  {
    path: "/403",
    element: <NotAuth />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "/500",
    element: <ServerError />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];

// 异步路由，渲染动态路由
export const layoutRoutes: AppRouteObject[] = [...staticRoutes, ...asyncRoutes];
