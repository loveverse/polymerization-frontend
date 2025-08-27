declare global {
  // 原有的全局类型定义（Writable、Recordable 等）
  type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  // 完善后的 DeepPartial
  type DeepPartial<T> =
    T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Function
        ? T
        : T extends object
          ? { [P in keyof T]?: DeepPartial<T[P]> }
          : T
}

export {}
