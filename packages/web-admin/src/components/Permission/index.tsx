import { useAppContext } from "@/context"
import { JSX } from "react"

interface PermissionProps {
  code: string | string[]
  children: JSX.Element
  fallback?: JSX.Element | null
}

const checkPermission = (authCode: string | string[], permissions: string[]): boolean => {
  // 如果authCode是数组，检查是否有任一权限
  if (Array.isArray(authCode)) {
    return authCode.some(k => permissions.includes(k))
  }
  // 字符串权限码直接检查
  return permissions.includes(authCode)
}

const Permission = ({ code, children, fallback = null }: PermissionProps) => {
  const { permissions } = useAppContext()
  const hasPermission = checkPermission(code, permissions)
  return hasPermission ? children : fallback
}
export default Permission
