# 聚合多应用网站

## 网站目录
- `backend-manage(40200)`: 后台管理
- `wallpaper-module-web(40300)`: 壁纸网站

## 幽灵依赖
npm/yarn安装依赖时，存在依赖提升，某个项目使用的依赖，并没有在其 package.json 中声明，也可以直接使用，这种现象为”幽灵依赖“。
随着项目迭代，这个依赖不再被其他项目使用，不再被安装，使用幽灵依赖的项目，会因为无法找到依赖而报错

## monorepo 和 pnpm
组件库，工具类结构为
packages
    shared
    module
    module2
