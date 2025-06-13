/* 公用接口类型 */
interface PageResult<T = any> {
  current?: number;
  page: number;
  size: number;
  data: T[];
  total: number;
}

interface PageParam {
  page: number;
  size: number;
}

interface CommonId {
  id: string;
}

/* 除某些类型外，其他类型为可选 */
type PartialExcept<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P];
} & {
  [P in keyof T as P extends K ? never : P]?: T[P];
};

