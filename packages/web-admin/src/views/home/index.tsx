import React, { useEffect, useState } from "react"
import { App, Avatar, Button, Card, List } from "antd"
import dayjs from "dayjs"

import styles from "./index.module.scss"
import { PageResult, Recordable } from "@poly/shared"
import { ModuleDataRes } from "@/api/module/types"
import { reqModuleList } from "@/api/module"
import { CURRENT_MODULE_KEY } from "@/utils/constant"
import { reqCommitPage } from "@/api/third-party"

const Home = () => {
  const { message } = App.useApp()
  const [commitData, setCommitData] = useState<PageResult<Recordable>>({
    page: 1,
    size: 20,
    data: [],
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const getCommitPage = async (page = commitData.page, size = commitData.size) => {
    setLoading(true)
    const token = "65275e1082eb9a9712b3aae61749c2e9"
    const sha = "main"
    const res = await reqCommitPage({
      access_token: token,
      sha,
      page,
      per_page: size,
    })
    if (res.code === 200) {
      setCommitData({ ...commitData, data: res.data.data })
    } else {
      message.error(res.msg)
    }
    setLoading(false)
  }

  const [moduleList, setModuleList] = useState<ModuleDataRes[]>([])
  const getModuleList = async () => {
    const res = await reqModuleList()
    if (res.code === 200) {
      setModuleList(res.data.filter(k => k.moduleValue !== CURRENT_MODULE_KEY))
    } else {
      message.error(res.msg)
    }
  }

  useEffect(() => {
    void getModuleList()
    void getCommitPage()
  }, [])

  return (
    <div className={styles.root}>
      <Card title="快捷入口" className="system-list">
        {moduleList.map(item => (
          <Card.Grid
            key={item.id}
            className="item"
            onClick={() => {
              window.open("http://39.108.120.75/#/login", "_blank")
            }}>
            <Button type="link">{item.moduleName}</Button>
          </Card.Grid>
        ))}

        {/* <Card.Grid className="system-list"></Card.Grid> */}
      </Card>
      <Card title="更新日志">
        <List
          itemLayout="horizontal"
          dataSource={commitData.data}
          loading={loading}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.committer.avatar_url} />}
                title={
                  <a href={item.html_url} target="_blank" rel="noreferrer">
                    {item.commit.message}
                  </a>
                }
                description={dayjs(item.commit.committer.date).format("YYYY-MM-DD HH:mm:ss")}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Home
