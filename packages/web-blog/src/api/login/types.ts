import { Dayjs } from "dayjs"

type LoginType = "student" | "teacher"
type LoginDevice = "pc" | "app" | "desktop"
export interface ReqLoginForm {
  username: string
  password: string
  loginType?: LoginType
  loginDevice?: LoginDevice
}
export interface ResLogin {
  permission: any[]
  token: string
  user: Record<string, any>
}
interface TeacherRole {
  teacherId: string
  roleId: string
  id: string
  roleName: string
}
interface TeacherCourse {
  classId: string
  periodId: string
  courseId: string
  teacherId: string
  schoolId: string
  id: string
  className: string
  courseName: string
  gradeId: string
  gradeName: string
}
export interface UserInfoRes {
  id: string
  phoneNumber: string
  gender: string
  headImg: string
  teacherName: string
  schoolId: string
  schoolName: string
  birthday?: number | Dayjs
  teacherRoles: TeacherRole[]
  teacherCourses?: TeacherCourse[]
}
export interface CaptchaImgReq {
  params: {
    w?: number
    h?: number
  }
  uuid: string
}
export interface AddUserReq {
  userName: string
  password: string
}
