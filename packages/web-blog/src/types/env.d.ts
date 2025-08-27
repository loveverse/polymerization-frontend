/// <reference types="vite/client" />

/**
 * 扩展现有全局类型用直接声明，定义全新全局类型（尤其在模块中）用 declare global
 */
// 扩展 ViteEnv 类型，添加项目特定的环境变量
declare interface ViteEnv {
  readonly VITE_DOMAIN: string
  readonly VITE_UPLOAD_URL: string
  readonly VITE_PREVIEW_URL: string
  readonly VITE_PUBLIC_PATH: string
}

// 重新声明 ImportMetaEnv 以确保合并生效
declare interface ImportMetaEnv extends ViteEnv {}

// 重新声明 ImportMeta 以确保环境变量类型正确
declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
