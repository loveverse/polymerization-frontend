import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { ComTitle } from "@/components";
import { reqViewExperiment } from "@/api/aiModel";
import { useLocation } from "react-router-dom";
import { Radio, Space, Table, TableColumnsType, Tag, message } from "antd";
import { ViewExperimentRes } from "@/api/aiModel/types";
import { useAppContext } from "@/context";

const ViewExperiment = () => {
  const { dicts } = useAppContext();
  const { state } = useLocation();
  const [experimentInfo, setExperimentInfo] = useState<Partial<ViewExperimentRes>>({});
  const fetchExperimentContent = async () => {
    const res = await reqViewExperiment({
      aiContentId: state.id,
    });
    if (res.code === 200) {
      setExperimentInfo(res.data);
    } else {
      message.error(res.message);
    }
  };
  const columns: TableColumnsType = [
    {
      title: "步骤",
      align: "center",
      render(vlaue, record, index) {
        return index + 1;
      },
    },
    {
      title: "操作要求",
      align: "center",
      dataIndex: "requirements",
    },
    {
      title: "评分标准/标签",
      align: "center",
      dataIndex: "evaluates",
      className: "standard-box",
      render: (value) => {
        return value.map((item: any, index: number) => {
          return (
            <div key={index} className="standard">
              <span className="standard-text">
                {index + 1}、{item.evaluateContent}
              </span>
              <Space>
                {item.tags.map((n: any) => {
                  return (
                    <Tag key={n.key} color="processing">
                      {n.value}
                    </Tag>
                  );
                })}
              </Space>
            </div>
          );
        });
      },
    },

    // {
    //   title: "得分标签",
    //   align: "center",
    //   // dataIndex: "evaluates",
    //   // render: (value) => {
    //   //   console.log("[ value ] >", value);
    //   //   return value.map((item: any) => {
    //   //     return (
    //   //       <div key={item.id}>
    //   //         <Space>
    //   //           {item.tags.map((n: any) => {
    //   //             return (
    //   //               <Tag key={n.key} color="processing">
    //   //                 {n.value}
    //   //               </Tag>
    //   //             );
    //   //           })}
    //   //         </Space>
    //   //       </div>
    //   //     );
    //   //   });
    //   // },
    // },
    {
      title: "设置分值",
      align: "center",
    },
  ];
  useEffect(() => {
    fetchExperimentContent();
  }, []);

  return (
    <div className={styles["root"]}>
      <div className="experiment-info">
        <h3>{experimentInfo.name}</h3>
        <ul className="experiment-little-info">
          <li>
            <span>学科：</span>
            <b>化学</b>
          </li>
          <li>
            <span>创建人：</span>
            <b>111</b>
          </li>
          <li>
            <span>创建时间：</span>
            <b>2022/1/12</b>
          </li>
        </ul>
      </div>
      <div className="experiment-content">
        <div className="experiment-require">
          <ComTitle title="实验要求" />
          <div className="text">{experimentInfo.requirements}</div>
        </div>
        <div className="experiment-equipment">
          <ComTitle title="实验器材" />
          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: experimentInfo.equipments! }}></div>
        </div>
        <div>
          <ComTitle title="操作步骤与评分要求" />
          <Table
            columns={columns}
            dataSource={experimentInfo.steps}
            rowKey={(record) => record.id}
            bordered
            pagination={false}
          />
        </div>
        <div className="report">
          <ComTitle title="实验报告" />
          <ul>
            {experimentInfo.questions
              ? experimentInfo.questions.map((item) => {
                  return (
                    <li key={item.id}>
                      <div
                        className="topic_name"
                        dangerouslySetInnerHTML={{
                          __html: `${item.sn + 1}.【${dicts.getLabel(
                            "experiment_question_type",
                            item.questionType
                          )}】${item.question.replace(/@@/g, "____")}`,
                        }}></div>
                      <div className="answer">
                        <div>【答案】：</div>
                        {item.questionType === "CHOICE" ? (
                          <Radio.Group
                            defaultValue={true}
                            disabled
                            options={item.expands.map((n: any) => {
                              return {
                                label: n.content,
                                value: n.answer,
                              };
                            })}
                          />
                        ) : null}
                        {item.questionType === "DROP_DOWN" || item.questionType === "FILL_BLANK"
                          ? item.expands
                              .filter((v: any) => v.answer)
                              .map((n: any) => {
                                return (
                                  <Tag key={n.id} color="processing">
                                    {item.questionType === "DROP_DOWN" ? n.content : n.answer}
                                  </Tag>
                                );
                              })
                          : null}
                        {item.questionType === "SENSOR" ? (
                          <div>
                            {item.expands.map((n: any) => {
                              return (
                                <div key={n.id}>
                                  传感器：{dicts.getLabel("sensor_type", n.model)}；
                                  {dicts.getLabel("way_type", n.readingMethod)}：{n.standard}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div>【解析】:{item.parse}</div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewExperiment;
