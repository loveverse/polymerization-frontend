import { useEffect, useState } from "react";
import { Progress, Radio, Select, Space, message } from "antd";
import styles from "./index.module.scss";
import { BarChart, ComEmpty } from "@/components";
import {
  reqDeviceCountBySchool,
  reqExperimentAndPracticeInfo,
  reqSchoolCount,
  reqSetUpCourseInfo,
} from "@/api/home";
import { reqSchoolPage } from "@/api/school";
import {SchoolDataRes, SchoolPageParam} from "@/api/school/types";
import {
  CountList,
  DeviceCountBySchoolRes,
  ExperimentAndPracticeInfoReq,
  ExperimentAndPracticeInfoRes,
  SetUpCourseInfoReq,
} from "@/api/home/types";
import SchoolNum from "@/assets/imgs/school-num.png";
import TeacherNum from "@/assets/imgs/teacher-num.png";
import StudentNum from "@/assets/imgs/student-num.png";
import ExperimentNum from "@/assets/imgs/experiment-num.png";
import PracticeNum from "@/assets/imgs/practice-num.png";
import { useAppContext } from "@/context";
import ExperimentNum2 from "@/assets/imgs/experiment-num2.png";
import PracticeNum2 from "@/assets/imgs/practice-num2.png";
import TotalNum from "@/assets/imgs/total-num.png";

const RANGE_PRESETS = [
  { label: "近一周", value: 1 },
  { label: "近一个月", value: 2 },
  { label: "近三个月", value: 3 },
  { label: "近一年", value: 4 },
];
const schoolCountList: CountList[] = [
  {
    img: SchoolNum,
    color: "#EBF5FF",
    text: "总学校数",
    count: 0,
    key: "schoolCount",
  },
  {
    img: TeacherNum,
    color: "#FFF0F0",
    text: "总教师数",
    count: 0,
    key: "teacherCount",
  },
  {
    img: StudentNum,
    color: "#EBF5FF",
    text: "总学生数",
    count: 0,
    key: "studentCount",
  },
  {
    img: ExperimentNum,
    color: "#FFF8ED",
    text: "总实验数",
    count: 0,
    key: "experimentCount",
  },
  {
    img: PracticeNum,
    color: "#EBF5FF",
    text: "总实践数",
    count: 0,
    key: "practiceCount",
  },
];
const Home = () => {
  const { dict } = useAppContext();
  const [schoolId, setSchoolId] = useState(undefined);
  const [schoolName, setSchoolName] = useState("");
  const [schoolList, setSchoolList] = useState<SchoolDataRes[]>([]);
  const getSchoolList = async () => {
    const res = await reqSchoolPage({ page: 1, size: 10000, data: {} });
    if (res.code === 200) {
      setSchoolList(res.data.data);
    } else {
      message.error(res.msg);
    }
  };
  const [countList, setCountList] = useState<CountList[]>([]);
  const getSchoolCount = async (val?: string) => {
    const res = await reqSchoolCount({ schoolId: val });
    if (res.code === 200) {
      const list = schoolCountList.map((item) => {
        item.count = res.data[item.key];
        return item;
      });
      setCountList(list);
    } else {
      message.error(res.msg);
    }
  };

  const [deviceCountInfo, setDeviceCountInfo] = useState<DeviceCountBySchoolRes[]>([]);
  const getDeviceCount = async (val?: string) => {
    const res = await reqDeviceCountBySchool({ schoolId: val });
    if (res.code === 200) {
      setDeviceCountInfo(res.data);
    } else {
      message.error(res.msg);
    }
  };

  const [courseParams, setCourseParams] = useState({
    dateRange: 1,
    courseClassify: undefined,
  });
  const [courseInfo, setCourseInfo] = useState<DeviceCountBySchoolRes[]>([]);
  const getSetUpCourseInfo = async (info: SetUpCourseInfoReq) => {
    const res = await reqSetUpCourseInfo({
      courseClassify: info.courseClassify,
      dateRange: info.dateRange,
      schoolId: info.schoolId,
    });
    if (res.code === 200) {
      setCourseInfo(res.data);
    } else {
      message.error(res.msg);
    }
  };

  const [time, setTime] = useState(1);
  const [experimentAndPracticeInfo, setExperimentAndPracticeInfo] = useState<
    Partial<ExperimentAndPracticeInfoRes>
  >({});
  const getExperimentAndPracticeInfo = async (info: ExperimentAndPracticeInfoReq) => {
    const res = await reqExperimentAndPracticeInfo({
      dateRange: info.dateRange,
      schoolId: info.schoolId,
    });
    if (res.code === 200) {
      setExperimentAndPracticeInfo(res.data);
    } else {
      message.error(res.msg);
    }
  };
  useEffect(() => {
    getSchoolList();
    getSchoolCount();
    getDeviceCount();
    getSetUpCourseInfo({ dateRange: courseParams.dateRange });
    getExperimentAndPracticeInfo({ dateRange: time });
  }, []);

  return (
    <div className={styles.root}>
      <div className="school-info-header">
        <div className="header-box">
          <h2>{schoolName || "集团数据看板"}</h2>
          <Select
            showSearch
            allowClear
            value={schoolId}
            options={schoolList}
            fieldNames={{ value: "id", label: "schoolName" }}
            placeholder="全部学校"
            style={{ width: 200 }}
            onChange={(val, info: any) => {
              setSchoolId(val);
              setSchoolName(info?.schoolName);
              getSchoolCount(val);
              getDeviceCount(val);
              getSetUpCourseInfo({ ...courseParams, schoolId: val });
              getExperimentAndPracticeInfo({ dateRange: time, schoolId: val });
            }}></Select>
        </div>
        <ul className="total-count">
          {countList.map((item) => {
            return (
              <li key={item.key} style={{ backgroundColor: item.color }}>
                <img src={item.img} alt="" />
                <div className="count-box">
                  <span>{item.text}</span>
                  <p>{item.count}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="course-count-main">
        <div className="course-count-box">
          <div className="header-box">
            <h2>课程开设情况分析</h2>
            <Radio.Group
              buttonStyle="solid"
              optionType="button"
              value={courseParams.dateRange}
              options={RANGE_PRESETS}
              onChange={({ target: { value } }) => {
                setCourseParams({ ...courseParams, dateRange: value });
                getSetUpCourseInfo({ ...courseParams, schoolId: schoolId });
              }}></Radio.Group>
          </div>
          <div className="course-count">
            <Space>
              课程分类
              <Select
                allowClear
                options={dict.getDictItemList("course_classify").slice(1)}
                placeholder="全部课程"
                style={{ width: 150 }}
                onChange={(val) => {
                  setCourseParams({ ...courseParams, courseClassify: val });
                  getSetUpCourseInfo({ ...courseParams, courseClassify: val, schoolId: schoolId });
                }}></Select>
            </Space>
          </div>
          {courseInfo.length ? (
            <BarChart
              xType="value"
              yType="category"
              xName="数量"
              yName="课程"
              seriesData={[{ data: courseInfo.map((item) => item.count) }]}
              xAxisData={courseInfo.map((item) => item.name)}
            />
          ) : (
            <ComEmpty />
          )}
        </div>
        <div className="school-count-box">
          <h2 className="header-text">设备数量统计（总设备数量）top10</h2>
          {deviceCountInfo.length && schoolName ? (
            <div className="device-circle-box">
              <Progress
                size={280}
                type="circle"
                percent={deviceCountInfo[0].count}
                trailColor="#A2C9FF"
                strokeWidth={20}
                format={(percent) => (
                  <div style={{ display: "flex", flexDirection: "column", justifyItems: "center" }}>
                    <b>{percent}</b>
                    <span style={{ color: "#333", fontSize: 16, marginTop: 10 }}>该校总设备</span>
                  </div>
                )}
              />
            </div>
          ) : (
            <ul className="regiester-school-list">
              <li className="school-count-header">
                <div className="school-name">学校名称</div>
                <div>设备数量</div>
              </li>
              {deviceCountInfo.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="school-name">{item.name}</div>
                    <div>{item.count}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="experiment-count-footer">
        <div className="header-box">
          <h2>实验与实践统计分析</h2>
          <Radio.Group
            buttonStyle="solid"
            optionType="button"
            value={time}
            options={RANGE_PRESETS}
            onChange={({ target: { value } }) => {
              setTime(value);
              getExperimentAndPracticeInfo({ dateRange: value, schoolId: schoolId });
            }}></Radio.Group>
        </div>
        <div className="total-box">
          <ul className="total-count">
            <li>
              <img src={TotalNum} alt="" />
              <div className="count-box">
                <p>{experimentAndPracticeInfo.sumCount}次</p>
                <span>合计</span>
              </div>
            </li>
            <li className="other-box">
              <div className="left">
                <img src={ExperimentNum2} alt="" />
                <div className="count-box">
                  <p>{experimentAndPracticeInfo.aiExperimentCount}次</p>
                  <span>实验次数</span>
                </div>
              </div>
              <div className="line"></div>
              <div className="right">
                <div className="count-box">
                  <p>{experimentAndPracticeInfo.aiExperimentCount}次</p>
                  <span>AI实验</span>
                </div>
                <div className="count-box">
                  <p>{experimentAndPracticeInfo.cgExperimentCount}次</p>
                  <span>常规实验</span>
                </div>
              </div>
            </li>
            <li>
              <img src={PracticeNum2} alt="" />
              <div className="count-box">
                <p>{experimentAndPracticeInfo.practiceCount}次</p>
                <span>实践次数</span>
              </div>
            </li>
          </ul>
        </div>
        {experimentAndPracticeInfo.dateCount?.length ? (
          <BarChart
            isStack={false}
            seriesData={[
              {
                name: "实验",
                data: experimentAndPracticeInfo.dateCount.map((k) => k.count.experiment),
              },
              {
                name: "实践",
                data: experimentAndPracticeInfo.dateCount.map((k) => k.count.practice),
              },
            ]}
            xAxisData={experimentAndPracticeInfo.dateCount?.map((k) => k.date)}
            xName="时间"
            yName="次数"
          />
        ) : (
          <ComEmpty />
        )}
      </div>
    </div>
  );
};

export default Home;
