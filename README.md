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

## pnpm 命令

- pnpm i xxx -w: 全局安装依赖
- pnpm up: 更新子目录版本依赖已经通过workspace:\*

## 项目说明

- node >= 18
- pnpm >= 9

# 代码规范

- eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
  pnpm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

# React相关

npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks

# Vue相关

npm install --save-dev eslint-plugin-vue vue-eslint-parser

# 注意事项

- ESLint 在 v9.0.0 中做了重大变更：

默认配置文件从 .eslintrc.\*（旧的 JSON/JS 格式）改为 eslint.config.js（新的扁平配置格式）。

- --save-exact: 固定安装版本

# Prettier

.prettierrc（JSON 格式）
.prettierrcon
.prettierrc.yaml / .prettierrc.yml
.prettierrc.toml
package.json 中的 prettier 字段

# webStorm工具栏不折叠

View -> Appearance -> Show Main Menu in Separate Toolbar

# 显示虚拟空格

搜索virtual space -> Show virtual space at the bottom of the file

# webstorm 推荐插件

- One Dark Theme
- .ignore

set-ExecutionPolicy RemoteSigned

ElMessage 这种 API 根本不会被 unplugin-auto-import 的 ElementPlusResolver 自动生成，这是插件本身的限制（它对大部分组件 OK，但对 message/notification 这种“函数 API”支持不完整）。

# 子目录格式化问题，与webstorm不一致，在子模块放置prettier就好了

## Webstorm默认打开文件不是打开 prettier 和 eslint，设置 New Projects Setup -> prettier 和 eslint 每次使用项目配置

## 格式化项目

npx prettier --write .

## prettier 2.x 与 3.x 存在变化

旧版本（<2.0）可能默认使用 auto 策略（跟随系统换行符）
新版本（≥2.0）在未明确配置时，可能更严格地校验换行符，导致 Windows 系统的 CRLF（\r\n）被视为错误

## Prettier规范

- https://prettier.io/docs/options#end-of-line
- First available in v1.15.0, default value changed from auto to lf in v2.0.0

## Vs Code 创建文件默认 crlf
设置 -> files.eol -> \n
