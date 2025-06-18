import React, {useEffect, useState} from "react";
import {App, Button, Card} from "antd";
import axios from "axios";

import styles from "./index.module.scss";

const Home = () => {
  const {message} = App.useApp()
  const [commitData, setCommitData] = useState<PageResult<any[]>>({
    page: 1,
    size: 20,
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const getCommitPage = (page = commitData.page, size = commitData.size) => {
    const token = "65275e1082eb9a9712b3aae61749c2e9";
    const sha = "dev";
    const url = `https://gitee.com/api/v5/repos/clovsoft-code/zrt-front-zhzy/commits?access_token=${token}&sha=${sha}&page=${page}&per_page=${size}`;
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setCommitData({
          ...commitData,
          data: res.data,
        });
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getCommitPage();
  }, []);

  return (
    <div className={styles.root}>
      <Card title="快捷入口" className="system-list">
        <Card.Grid
          className="item"
          onClick={() => {
            window.open("http://39.108.120.75/#/login", "_blank");
          }}
        >
          <Button type="link">学业水平测试系统</Button>
        </Card.Grid>

        {/* <Card.Grid className="system-list"></Card.Grid> */}
      </Card>
      <Card title="更新日志">
        {/* <List
          itemLayout="horizontal"
          dataSource={commitData.data}
          loading={loading}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.committer.avatar_url} />}
                title={
                  <a href={item.html_url} target="_blank" rel="noreferrer">
                    {item.commit.message}
                  </a>
                }
                description={dayjs(item.commit.committer.date).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              />
            </List.Item>
          )}
        /> */}
      </Card>
    </div>
  );
};

export default Home;
