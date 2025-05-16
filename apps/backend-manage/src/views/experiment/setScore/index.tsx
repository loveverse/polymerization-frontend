import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  InputNumber,
  Radio,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useLocation } from "react-router-dom";
import { EditExperimentScoreReq, ViewExperimentRes } from "@/api/aiModel/types";
import { reqEditExperimentScore, reqViewExperimentContent } from "@/api/aiModel";
import { ComTitle } from "@/components";
import styles from "./index.module.scss";
import { useAppContext } from "@/context";

const SetScore = () => {
  const { state } = useLocation();
  const { dicts } = useAppContext();
  const [experimentInfo, setExperimentInfo] = useState<Partial<ViewExperimentRes>>({});
  const fetchExperimentContent = async () => {
    const res = await reqViewExperimentContent({
      id: state.id,
    });
    if (res.code === 200) {
      setExperimentInfo(res.data);
      setScoreParams({
        operationPercentage: res.data.operationPercentage,
        questionPercentage: res.data.questionPercentage,
        scoreType: res.data.scoreType,
      });
    } else {
      message.error(res.message);
    }
  };
  const columns: TableColumnsType<ViewExperimentRes["steps"][0]> = [
    {
      title: "步骤",
      align: "center",
      width: 120,
      render(vlaue, record, index) {
        return index + 1;
      },
    },
    {
      title: "操作要求",
      align: "center",
      dataIndex: "requirements",
      width: 180,
    },
    {
      title: "评分标准",
      align: "center",
      dataIndex: "evaluateRes",
      className: "standard-box",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => {
        return value.map((item: any, index: number) => {
          return (
            <div className="standard" key={index}>
              <Tooltip placement="topLeft" title={`${index + 1}、${item.evaluateContent}`}>
                {index + 1}、{item.evaluateContent}
              </Tooltip>
            </div>
          );
        });
      },
    },
    {
      title: "标签",
      align: "center",
      dataIndex: "evaluateRes",
      className: "standard-box",
      render(value) {
        return value.map((item: any, index: number) => {
          return (
            <div className="standard" key={index}>
              <Space>
                {item.tags.map((n: any, ni: number) => {
                  return (
                    <Tag key={ni} color="processing">
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
    {
      title: "设置分值",
      align: "center",
      width: 200,
      className: "score-box",
      render(value, record, recordIndex) {
        return record.evaluateRes.map((item: any, index: number) => {
          return (
            <div key={index} className="score">
              <InputNumber
                min={0}
                max={100}
                value={item.score}
                placeholder="设置分值"
                onChange={(val) => {
                  const cloneData = experimentInfo.steps?.slice() || [];
                  cloneData[recordIndex].evaluateRes[index].score = val;
                  setExperimentInfo({ ...experimentInfo, steps: cloneData });
                }}
              />
            </div>
          );
        });
      },
    },
  ];
  const questionColums: TableColumnsType<ViewExperimentRes["questionList"][0]> = [
    {
      title: "序号",
      width: 120,
      align: "center",
      render(value, record, index) {
        return index + 1;
      },
    },
    {
      title: "题型",
      dataIndex: "questionType",
      render(value) {
        return dicts.getLabel("experiment_question_type", value);
      },
    },
    {
      title: "题目内容",
      dataIndex: "question",
      render(value) {
        return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
      },
    },
    {
      title: "分值",
      dataIndex: "score",
      width: 200,
      align: "center",
      render(value, record, index) {
        return (
          <InputNumber
            value={value}
            min={0}
            max={100}
            onChange={(val) => {
              const cloneData = experimentInfo.questionList?.slice() || [];
              cloneData[index].score = val;
              setExperimentInfo({ ...experimentInfo, questionList: cloneData });
            }}
          />
        );
      },
    },
  ];
  const editExperimentScore = async () => {
    const res = await reqEditExperimentScore({
      ...scoreParams,
      experimentContentId: state.contentId,
      experimentStepList: experimentInfo.steps!.flatMap((item) => {
        return item.evaluateRes.map((n: any) => ({ id: n.id, score: n.score }));
      }),
      questionList: experimentInfo.questionList!.map((item) => {
        return {
          id: item.id,
          score: item.score,
        };
      }),
    });
    if (res.code === 200) {
      message.success("设置分值成功！");
    } else {
      message.error(res.message);
    }
  };
  const [scoreParams, setScoreParams] = useState<
    Pick<EditExperimentScoreReq, "scoreType" | "operationPercentage" | "questionPercentage">
  >({
    operationPercentage: 0,
    questionPercentage: 0,
    scoreType: "",
  });
  const questionScore = useMemo(() => {
    return experimentInfo.questionList
      ? experimentInfo.questionList?.reduce((pre: number, cur: any) => {
          return Number(cur.score) + pre;
        }, 0)
      : 0;
  }, [experimentInfo]);
  const stepScore = useMemo(() => {
    return experimentInfo.steps
      ? experimentInfo.steps.reduce((pre: number, cur: any) => {
          return cur.evaluateRes.reduce((p: number, c: any) => p + Number(c.score), 0) + pre;
        }, 0)
      : 0;
  }, [experimentInfo]);
  useEffect(() => {
    fetchExperimentContent();
  }, []);

  return (
    <div className={styles["root"]}>
      <div className="header-operation">
        <Radio.Group
          value={scoreParams.scoreType}
          options={[
            { label: "10分制", value: "TEN_POINT" },
            { label: "100分制", value: "HUNDRED" },
          ]}
          onChange={({ target: { value } }) =>
            setScoreParams({ ...scoreParams, scoreType: value })
          }></Radio.Group>
        <Button type="primary" onClick={() => editExperimentScore()}>
          保存
        </Button>
      </div>
      <div className="set-score-box">
        <div className="step-box">
          <ComTitle title="报告评分">
            <Space style={{ marginRight: 20 }}>
              占比：
              <InputNumber
                min={0}
                max={100}
                value={scoreParams.operationPercentage}
                onChange={(val: any) =>
                  setScoreParams({ ...scoreParams, operationPercentage: val })
                }
              />
              %
            </Space>
          </ComTitle>
          <Table
            columns={columns}
            dataSource={experimentInfo.steps}
            rowKey={(record) => record.id}
            bordered
            pagination={false}
            footer={() => (
              <Flex justify="space-between">
                <span style={{ marginLeft: 30 }}>合计</span>
                <span style={{ marginRight: 80 }}>{stepScore}</span>
              </Flex>
            )}
          />
        </div>
        <div>
          <ComTitle title="实验评分">
            <Space style={{ marginRight: 20 }}>
              占比：
              <InputNumber
                min={0}
                max={100}
                value={scoreParams.questionPercentage}
                onChange={(val: any) => setScoreParams({ ...scoreParams, questionPercentage: val })}
              />
              %
            </Space>
          </ComTitle>
          <Table
            columns={questionColums}
            dataSource={experimentInfo.questionList}
            rowKey={(record) => record.id}
            bordered
            pagination={false}
            footer={() => (
              <Flex justify="space-between">
                <span style={{ marginLeft: 30 }}>合计</span>
                <span style={{ marginRight: 80 }}>{questionScore}</span>
              </Flex>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SetScore;
