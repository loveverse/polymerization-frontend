// 字典


type DictItem = {
  value: string | number;
  label: string;
  dictId: string;
  name: string;
};
type Label = {
  [key: string]: {
    [key: string | number]: string;
  };
};
type Dict = {
  [key: string]: DictItem[];
};
type Dicts = {
  label: Label;
  dict: Dict;
  getDict: (type: string) => DictItem[];
  getLabel: (type: string, value: string) => string;
};

interface PeriodVos {
  periodId: string;
  periodName: string;
  courseVos: CourseVos[];
} // 学段
interface CourseVos {
  courseId: string;
  courseName: string;
  bookVersionVos: BookVersionVos[];
} // 课程
interface BookVersionVos {
  versionId: string;
  versionName: string;
  textBookVos: TextBookVos[];
} // 教材版本
interface TextBookVos {
  textbookId: string;
  textbookName: string;
  volumeType: string;
  gradeId: string;
  courseId: string;
  gradeName: string;
  periodId: string;
  versionId: string;
  isCurrentSemester?: number;
} // 教材的册级

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


/* 子组件通用类型 */
interface ChildRef {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChildProps<T = any> {
  handleSubmit: (params: T) => void;
}

interface ChildCallback {
  setShow: (value: boolean) => void;
}

interface CommonId {
  id: string;
}

interface BatchDeleteIds {
  ids: string[];
}

/* 除某些类型外，其他类型为可选 */
type PartialExcept<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P];
} & {
  [P in keyof T as P extends K ? never : P]?: T[P];
};

