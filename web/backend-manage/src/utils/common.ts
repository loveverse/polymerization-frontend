import {Base64} from "js-base64";
import {reqDownloadFile} from "@/api/base";
import {FILE_TYPE_LIST} from "./constant";
import {preViewUrl} from "@/config";
import React from "react";

/**
 * @description 对象数组深克隆
 * @param {Object} obj 源对象
 * @return object
 */
export const deepCopy = <T>(obj: any): T => {
  let newObj: any;
  try {
    newObj = obj.push ? [] : {};
  } catch (error) {
    newObj = {};
  }
  for (const attr in obj) {
    if (typeof obj[attr] === "object") {
      newObj[attr] = deepCopy(obj[attr]);
    } else {
      newObj[attr] = obj[attr];
    }
  }
  return newObj;
};

export const addItemAfterId = (tree: any[], id: string, type: string): any[] => {
  const newItem = {
    id: "",
    flag: true,
    children: [],
  };
  const removeFlaggedNodes = (arr: any[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].flag) {
        arr.splice(i, 1);
      } else if (arr[i].children) {
        removeFlaggedNodes(arr[i].children);
      }
    }
  };
  removeFlaggedNodes(tree);

  const traverseAndAdd = (tree: any[], id: string) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        if (type === "sub") {
          if (tree[i].children) {
            tree[i].children.push(newItem);
          } else {
            tree[i].children = [newItem];
          }
        } else if (type === "same") {
          tree.splice(i + 1, 0, newItem);
        } else {
          tree[i].flag = true;
        }
        return;
      }
      if (tree[i].children && tree[i].children.length > 0) {
        traverseAndAdd(tree[i].children, id);
      }
    }
  };
  traverseAndAdd(tree, id);

  return [...tree];
};

export const findIds = (tree: any, targetId?: string): string[] => {
  let result: string[] = [];

  function find(node: any, path: any) {
    path.push(node.id);
    if (node.id === targetId) {
      result = path.slice();
    } else if (node.children) {
      for (const child of node.children) {
        find(child, path);
      }
    }
    path.pop();
    if (node.children) {
      for (const child of node.children) {
        const found = find(child, [...path, node.id]);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  for (const node of tree) {
    find(node, []);
  }
  return result;
};

/**
 *
 * @param source 流和url
 * @param filename 文件名
 */
export const downloadFile = async (source: Blob | string, filename: string) => {
  try {
    let fileBlob;
    if (typeof source === "string") {
      fileBlob = await reqDownloadFile(source);
      if (!fileBlob) return;
    } else {
      fileBlob = source;
    }
    const node = document.createElement("a");
    node.href = window.URL.createObjectURL(fileBlob); // 将流文件写入a标签的href属性值
    node.setAttribute("download", filename); // 可以自定义文件名
    node.style.display = "none"; // 障眼法藏起来a标签
    document.body.appendChild(node); // 将a标签追加到文档对象中
    node.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
    node.remove(); // 一次性的，用完就删除a标签
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// 展开的所有节点
export const expandedKeysLoop = (list: any[]): React.Key[] => {
  const arr: React.Key[] = [];
  const loop = (data: any[]) => {
    data.forEach((item: any) => {
      arr.push(item.nodeId);
      if (item.children && item.children.length) {
        if (item.children[0].children) {
          loop(item.children);
        }
      }
    });
  };
  loop(list);
  return arr;
};

/**
 * 获取文件后缀
 * @param fileName 文件名称
 */
function sliceFileName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : "";
}

/**
 * 根据后端返回的文件/文件类型返回匹配的图片
 * @param fileName 文件名称
 */
export const findFileLogo = (fileName: string) => {
  const suffix = sliceFileName(fileName);
  const file = FILE_TYPE_LIST.find((item) => item.list.includes(suffix));
  if (file) {
    return file.logoImg;
  }
  return FILE_TYPE_LIST[0].logoImg;
};
/**
 * 根据后端返回的文件/文件类型返回匹配的资源类型
 * @param fileName 文件名称
 */
export const findFileType = (fileName: string) => {
  const suffix = sliceFileName(fileName);
  const file = FILE_TYPE_LIST.find((item) => item.list.includes(suffix));
  if (file) {
    return file.value;
  }
  return FILE_TYPE_LIST[0].value;
};

export const convertorFileSize = (fileSize: number | string) => {
  if (typeof fileSize !== "number") {
    try {
      fileSize = +fileSize;
    } catch (error) {
      return "";
    }
  }
  let data = "";
  if (fileSize < 1 * 1024) {
    //如果小于0.1KB转化成B
    data = fileSize.toFixed(2) + "B";
  } else if (fileSize < 1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    data = (fileSize / 1024).toFixed(2) + "KB";
  } else if (fileSize < 1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    data = (fileSize / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    data = (fileSize / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  // let len = sizestr.indexOf("\.");
  // let dec = sizestr.substring(len + 1, len + 3);
  // if (dec == "00") {//当小数点后为00时 去掉小数部分
  //     return sizestr.substring(0, len) + sizestr.substring(len + 3, len + 5);
  // }
  return data + "";
};
/**
 *
 * @param url 文件路径
 * @returns 预览url
 */
export const generatePreviewURL = (url?: string) => {
  if (!url) return "";
  const encodedURL = encodeURIComponent(Base64.encode(decodeURI(url)));
  return `${preViewUrl}?url=${encodedURL}`;
};
// eslint-disable-next-line no-debugger
// debugger
/**
 * 在树结构中查找特定节点的路径
 * @param tree - 树结构数组
 * @param value - 要查找的节点的值
 * @param valueKey - 节点值对应的键，默认是 'id'
 * @param path - 存储查找到的路径
 * @param pidKey - 父节点对应的键，默认是 'pid'
 * @param treeCopy - 原始树结构的拷贝，用于递归查找父节点
 * @returns 返回查找到的路径或 undefined
 */
export const findTreeListById = (
  tree: any[],
  value: string | number,
  valueKey = "id",
  list: any[] = [],
  pidValue = "pid",
  treeCopy: any[]
) => {
  for (const item of tree) {
    if (item[valueKey] === value) {
      list.unshift(item);
      const pidList = item[pidValue].split("_");
      if (item[pidValue] == "0" || (pidList.length > 1 && pidList[pidList.length - 1] == "0")) {
        return list;
      } else if (item[pidValue]) {
        const result: any = findTreeListById(
          treeCopy,
          item[pidValue],
          valueKey,
          list,
          pidValue,
          treeCopy
        );
        if (result) {
          return result;
        }
      }
    }
    if (item.children && item.children.length > 0) {
      const result: any = findTreeListById(
        item.children,
        value,
        valueKey,
        list,
        pidValue,
        treeCopy
      );
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

// 生成数字
export function generateArray(start = 3, end = 7, flag = false) {
  const result: any[] = [];
  for (let i = start; i <= end; i++) {
    if (flag) {
      result.push(i);
    } else {
      result.push({value: i, label: i});
    }
  }
  return result;
}

// 生成ABCD
export const generateLetter = (
  num: number, // 个数
  type: string, // 类型
  flag = false // false: 生成数组,true: 生成对象数组
): string[] | any[] => {
  if (type === "pd") {
    num = 2;
  }
  if (type === "hh") {
    num = 4;
  }
  const includesType = ["sxz", "mxz", "pd", "hh"];
  return Array.from({length: num}, (_, i) => {
    const text = String.fromCharCode(65 + i);
    let label = text;
    if (type === "pd") {
      label = label === "A" ? "√" : "×";
    }
    if (flag) {
      return {value: text, label: label};
    }
    return includesType.includes(type) ? text : "";
  });
};
