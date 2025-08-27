import "vue-router"
import { Component } from "vue"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * antd menu selectedKeys
     */
    key?: string
    /**
     * menu label, i18n
     */
    label?: string
    /**
     * 路由组件缓存
     */
    keepAlive?: boolean
    /**
     * menu prefix icon
     */
    icon?: Component | string
    /**
     * 菜单不需要权限
     */
    permission?: boolean
    /**
     * menu suffix icon
     */
    suffix?: Component
    /**
     * hide in menu
     */
    hideMenu?: boolean
    /**
     * hide in multi tab
     */
    hideTab?: boolean
    /**
     * disable in menu
     */
    disabled?: boolean

    /**
     * use to refresh tab
     */
    timeStamp?: string
    /**
     * external link and iframe need
     */
    frameSrc?: string
    /**
     * dynamic route params
     *
     * @example /user/:id
     */
    params?: Params<string>
  }
}
