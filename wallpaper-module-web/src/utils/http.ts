import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig, AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import {ElMessage} from "element-plus";

import {domain, publicPath} from "@/config";
import {SERVER_STATUS} from "@/utils/constant";

interface ApiResponse<T> {
  code: string | number;
  data: T;
  msg?: string;
}

const config: AxiosRequestConfig = {
  baseURL: domain,
  withCredentials: false, // 跨域时候允许携带凭证
};

class RequestHttp {
  service: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        // token && (config.headers["ZRT-ADMIN-TOKEN"] = token);
        token && (config.headers["zrt-embodied-token"] = token);
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        // 判断接口返回的状态
        return response;
      },
      async (error: AxiosError) => {
        console.error(error);
        if (error && error.response) {
          const errorData = {
            code: error.response.status,
            message: SERVER_STATUS[error.response.status] ?? "系统繁忙，请刷新后重试！",
          };

          ElMessage.error(errorData.message);
          return Promise.reject(errorData);
        }
        return Promise.reject({
          code: 10000,
          message: "系统繁忙，请刷新后重试！",
        });
      }
    );
  }

  private handleResponse<T>(res: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const data = res.data;
    if (data.code === 401) {
      localStorage.removeItem("token");
      window.location.replace(window.origin + publicPath + "#/login");
      window.location.reload();
      throw new Error(data.msg);
    }
    return data;
  }

  private handleError(err: any) {
    console.error(err);
    return err;
  }

  async get<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config;
      const res = await this.service.get<ApiResponse<T>>(url, {...axiosConfig, params});
      return this.handleResponse(res);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async post<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config;
      const response = await this.service.post<ApiResponse<T>>(url, params, axiosConfig);
      return this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }
}

type ContentType = "urlencoded" | "formData" | "jsonBlob" | "formBlob";
const getConfig = (type: ContentType): AxiosRequestConfig => {
  const configMap: Record<ContentType, AxiosRequestConfig> = {
    // 当需要序列化引入qs，给getConfig添加是否序列化参数
    urlencoded: {headers: {"Content-Type": "application/x-www-form-urlencoded"}},
    formData: {headers: {"Content-Type": "multipart/form-data"}},
    jsonBlob: {responseType: "blob"},
    formBlob: {
      responseType: "blob",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
    },
  };
  return configMap[type];
};
export default new RequestHttp(config);
