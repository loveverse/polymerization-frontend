import http from "@/utils/http"
import { CommitPageReq } from "@/api/third-party/types"
import { PageResult, Recordable } from "@poly/shared"

export const reqCommitPage = (params: CommitPageReq) =>
  http.get<PageResult<Recordable>>(
    "https://gitee.com/api/v5/repos/loveverse/polymerization-frontend/commits",
    params,
  )
