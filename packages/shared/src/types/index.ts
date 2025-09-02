// 原有的全局类型定义（Writable、Recordable 等）
export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}
// @ts-ignore: 通用类型
export type Recordable<T = any> = Record<string, T>
export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}

// 完善后的 DeepPartial
export type DeepPartial<T> =
  T extends Array<infer U>
    ? DeepPartial<U>[]
    : T extends Function
      ? T
      : T extends object
        ? { [P in keyof T]?: DeepPartial<T[P]> }
        : T

/* 除某些类型外，其他类型为可选 */
export type PartialExcept<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]?: T[P]
}

/* 公用接口类型 */
export interface PageResult<T = any> {
  current?: number
  page: number
  size: number
  data: T[]
  total: number
}

export interface PageParam {
  page: number
  size: number
}

export interface CommonId {
  id: string
}
