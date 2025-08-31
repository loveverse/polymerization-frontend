import { defineStore } from "pinia"
import store from "./index"
import type { RouteRecordRaw } from "vue-router"

export interface PermissionState {
  permissionCodes: Set<string>
  asyncRoutes: RouteRecordRaw[]
}

export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => ({
    permissionCodes: new Set<string>(),
    asyncRoutes: [],
  }),
  actions: {
    setPermissions(codes: string[]) {
      this.permissionCodes = new Set(codes)
    },
    filterRoutesByUserRoutes(localRoutes: RouteRecordRaw[], userRoutes: RouteRecordRaw[]) {
      // const filterMenu = () => {
      //   return localRoutes.map()
      // }
      // return filterMenu(localRoutes, userRoutes)
    },
  },
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
