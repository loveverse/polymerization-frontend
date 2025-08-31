export interface ImagesProps {
  "ai-model.png": string
  "course.png": string
  "courseware.png": string
  "decorate-cover.png": string
  "echarts.png": string
  "empty.png": string
  "experiment.png": string
  "home.png": string
  "ikon.png": string
  "logo.png": string
  "register-school.png": string
  "report.png": string
  "school-num.png": string
  "school.png": string
  "server-device.png": string
  "student-num.png": string
  "system.png": string
  "target.png": string
  "teacher-num.png": string
  "un-ai-model.png": string
  "un-course.png": string
  "un-courseware.png": string
  "un-experiment.png": string
  "un-home.png": string
  "un-report.png": string
  "un-school.png": string
  "un-server-devicce.png": string
  "un-system.png": string
  "un-target.png": string
  "un-user.png": string
  "user.png": string
  "组 303@1x.png": string
  "组 337@1x.png": string
}
export type ImageKeysProps = keyof ImagesProps

const requireContext = require.context("../imgs", true, /^\.\/.*\.png$/)
export const images: ImagesProps = requireContext.keys().reduce((acc, key) => {
  // 移除路径中的 './' 并保留文件名
  const fileName = key.replace("./", "") as keyof ImagesProps
  // 将文件名作为键，图片模块作为值
  acc[fileName] = requireContext(key)
  return acc
}, {} as ImagesProps)
