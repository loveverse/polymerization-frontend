import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
} from "axios"
import { domain } from "@/config"
import { SERVER_STATUS } from "@/utils/constant"
import { Recordable } from "@poly/shared"

export interface ApiResponse<T> {
  code: string | number
  data: T
  msg: string
  errorInfo: null | string[]
}

type ContentType = "urlencoded" | "formData" | "jsonBlob" | "formBlob"
type ResponseDataType<T> = T extends Blob ? Blob : ApiResponse<T>

const config: AxiosRequestConfig = {
  baseURL: domain,
  withCredentials: false, // 跨域时候允许携带凭证
  timeout: 20000,
  /**
   * 修改为所有请求通过，方便后续扩展
   *
   * 参考：{@link https://github.com/axios/axios/blob/main/lib/defaults/index.js}
   */
  // validateStatus: () => true,
}

class RequestHttp {
  service: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("backend-token")
        token && (config.headers["Authorization"] = token)
        return config
      },
      // 这里通常不会被执行，除非 request.use 代码执行错误
      (error: AxiosError) => Promise.reject(error),
    )
    this.service.interceptors.response.use(
      // axios 默认这里只会进来 2xx 响应，其他状态码会进入这里
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        // 这里可以处理客户端 4xx 和 5xx 状态码
        if (error && error.response) {
          const errorData = {
            code: error.response.status,
            msg: SERVER_STATUS[error.response.status] ?? "系统繁忙，请刷新后重试！",
          }
          return Promise.reject(errorData)
        }
        // 服务没响应会执行到此，继续传递下去，防止模块中 loading 无法取消
        return Promise.reject({
          code: 10000,
          msg: "网络错误，请检查网络设置！",
        })
      },
    )
  }

  private normalizeConfig(
    config?: AxiosRequestConfig | ContentType,
  ): AxiosRequestConfig | undefined {
    // 如果没有提供配置，则返回 undefined
    if (!config) return undefined

    // 如果提供的配置是字符串类型（即 ContentType）
    if (typeof config === "string") {
      // 定义 ContentType 到 AxiosRequestConfig 的映射
      const configMap: Record<ContentType, AxiosRequestConfig> = {
        urlencoded: { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        formData: { headers: { "Content-Type": "multipart/form-data" } },
        jsonBlob: { responseType: "blob" },
        formBlob: {
          responseType: "blob",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      }
      // 返回对应的配置
      return configMap[config]
    }
    // 如果提供的配置已经是 AxiosRequestConfig 类型，直接返回
    return config
  }

  private async request<T = Recordable>(
    method: Method,
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<ResponseDataType<T>> {
    try {
      const response = await this.service.request<T>({
        method,
        url,
        ...config,
      })
      // const data = response.data as ApiResponse<T>
      // if (data && data.code === 401) {
      //   localStorage.removeItem("backend-token")
      //   window.location.replace(window.origin + publicPath + "#/login")
      // }
      return response.data as ResponseDataType<T>
    } catch (error) {
      // 继续往外抛出，防止模块中 loading 无法取消
      // 不使用 reject 主要防止调用时需要 try catch
      return Promise.resolve(error as ResponseDataType<T>)
    }
  }

  async get<T = Recordable>(
    url: string,
    params: Recordable = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ResponseDataType<T>> {
    const axiosConfig = this.normalizeConfig(config)
    return this.request<T>("GET", url, { ...axiosConfig, params })
  }

  async post<T = Recordable>(
    url: string,
    params: Recordable = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ResponseDataType<T>> {
    const axiosConfig = this.normalizeConfig(config)
    return this.request<T>("POST", url, { ...axiosConfig, data: params })
  }

  async put<T = Recordable>(
    url: string,
    params: Recordable = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ResponseDataType<T>> {
    const axiosConfig = this.normalizeConfig(config)
    return this.request("PUT", url, { ...axiosConfig, data: params })
  }

  async delete<T = Recordable>(
    url: string,
    params: Recordable = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ResponseDataType<T>> {
    const axiosConfig = this.normalizeConfig(config)
    return this.request<T>("DELETE", url, { ...axiosConfig, params })
  }
}

export default new RequestHttp(config)
