import { execSync } from "child_process"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

// 获取路径信息（ESM兼容）
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..") // 假设脚本在scripts目录，上级为项目根目录

// 检测操作系统，使用对应的路径分隔符
const sep = path.sep

/**
 * 执行rimraf命令删除目录
 * @param {string} path 要删除的路径
 */
function deleteWithRimraf(path) {
  try {
    console.log(`正在删除: ${path}`)
    execSync(`rimraf "${path}"`, { stdio: "inherit" })
    console.log(`✅ 成功删除: ${path}`)
  } catch (err) {
    console.error(`❌ 删除失败: ${path}`, err.message)
  }
}

/**
 * 递归查找所有node_modules并删除
 * @param {string} currentDir 当前查找目录
 */
async function findAndClean(currentDir) {
  try {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      // 如果是目录
      if (entry.isDirectory()) {
        // 找到node_modules直接删除
        if (entry.name === "node_modules") {
          deleteWithRimraf(fullPath)
        } else {
          // 检查是否是子模块目录（包含package.json的目录视为潜在子模块）
          try {
            await fs.access(path.join(fullPath, "package.json"))
            // 子模块目录下可能有node_modules，先检查并删除
            const subModuleNodeModules = path.join(fullPath, "node_modules")
            try {
              await fs.access(subModuleNodeModules)
              deleteWithRimraf(subModuleNodeModules)
            } catch {
              // 子模块目录下没有node_modules，继续递归
            }
          } catch {
            // 不是子模块目录，继续递归查找
          }

          // 继续递归处理更深层次的目录
          await findAndClean(fullPath)
        }
      }
    }
  } catch (err) {
    if (err.code !== "EACCES" && err.code !== "ENOENT") {
      console.error(`❌ 查找目录出错: ${currentDir}`, err.message)
    }
  }
}

// 从项目根目录开始执行清理
findAndClean(projectRoot)
  .then(() => console.log("✨ 所有node_modules清理完成"))
  .catch(err => console.error("❌ 清理过程发生错误:", err))
