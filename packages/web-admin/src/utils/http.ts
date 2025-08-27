import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { message } from "antd"
import { domain, publicPath } from "@/config"
import { SERVER_STATUS } from "@/utils/constant"

export interface ApiResponse<T> {
  code: string | number
  data: T
  msg: string
  errorInfo: null | string[]
}

const config: AxiosRequestConfig = {
  baseURL: domain,
  withCredentials: false, // 跨域时候允许携带凭证
  timeout: 20000,
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
      (error: AxiosError) => Promise.reject(error),
    )
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        // 判断接口返回的状态
        return response
      },
      async (error: AxiosError) => {
        console.error(error)
        if (error && error.response) {
          const errorData = {
            code: error.response.status,
            msg: SERVER_STATUS[error.response.status] ?? "系统繁忙，请刷新后重试！",
          }
          message.error(errorData.msg)
          return Promise.reject(errorData)
        }
        return Promise.reject({
          code: 10000,
          msg: "网络错误，请检查网络设置！",
        })
      },
    )
  }

  private handleResponse<T>(res: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const data = res.data
    if (data.code === 401) {
      localStorage.removeItem("backend-token")
      window.location.replace(window.origin + publicPath + "#/login")
    }
    return data
  }

  private handleError(err: any) {
    console.error(err)
    return err
  }

  async get<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<T extends Blob ? Blob : ApiResponse<Exclude<T, Blob>>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config
      const res = await this.service.get<T>(url, { ...axiosConfig, params })
      if (axiosConfig?.responseType === "blob") {
        return res.data as T extends Blob ? Blob : never
      }
      return this.handleResponse(res as AxiosResponse<ApiResponse<Exclude<T, Blob>>>) as any
    } catch (err) {
      return this.handleError(err)
    }
  }

  async post<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config
      const response = await this.service.post<ApiResponse<T>>(url, params, axiosConfig)
      return this.handleResponse(response)
    } catch (err) {
      return this.handleError(err)
    }
  }

  async put<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config
      const response = await this.service.put<ApiResponse<T>>(url, params, axiosConfig)
      return this.handleResponse(response)
    } catch (err) {
      return this.handleError(err)
    }
  }

  async delete<T = any>(
    url: string,
    params: any = {},
    config?: AxiosRequestConfig | ContentType,
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig = typeof config === "string" ? getConfig(config) : config
      const response = await this.service.delete<ApiResponse<T>>(url, { ...axiosConfig, params })
      return this.handleResponse(response)
    } catch (err) {
      return this.handleError(err)
    }
  }
}

type ContentType = "urlencoded" | "formData" | "jsonBlob" | "formBlob"
const getConfig = (type: ContentType): AxiosRequestConfig => {
  const configMap: Record<ContentType, AxiosRequestConfig> = {
    // 当需要序列化引入qs，给getConfig添加是否序列化参数
    urlencoded: { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    formData: { headers: { "Content-Type": "multipart/form-data" } },
    jsonBlob: { responseType: "blob" },
    formBlob: {
      responseType: "blob",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  }
  return configMap[type]
}

export default new RequestHttp(config)
