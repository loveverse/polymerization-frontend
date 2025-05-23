import {useEffect, useRef} from "react";
import {Empty, Spin} from "antd";
import type {EmptyProps, SpinProps} from "antd";
import imgEmpty from "@/assets/imgs/empty.png";
import styles from "./index.module.scss";

type LoadingVariant = "default" | "full";

interface SpinLoadingProps extends SpinProps {
  variant?: LoadingVariant;
  hasData?: boolean | number; // 数据是否为空
  emptyProps?: EmptyProps;
}

/**
 *
 * @param props spin参数
 * @returns
 * @description 支持全屏上下垂直居中loading，支持数据获取时loading
 */
const SpinLoading = (props: SpinLoadingProps) => {
  const {variant = "default", hasData, children, emptyProps, ...spinProps} = props;
  const mergeHasData = Boolean(hasData);
  const isFirstRender = useRef(true); // 用于判断是否为首次渲染

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  const customloadingIcon = (
    <div className="loading-icon-box">
      {/*[...Array(9)].map*/}
      {Array.from({length: 9}, (_value, index) => (
        <div className="banter-loader__box" key={index}></div>
      ))}
    </div>
  );
  if (variant === "full") {
    return (
      <Spin
        {...spinProps}
        className={styles["full-loading-wrapper"]}
        indicator={customloadingIcon}></Spin>
    );
  }
  return (
    <Spin
      {...spinProps}
      wrapperClassName={styles["loading-wrapper"]}
      size="large"
      tip="正在加载中...">
      {/* {mergeHasData || isFirstRender.current ? (
        children
      ) : spinProps.spinning ? null :  (
        <ComEmpty {...emptyProps} />
      )} */}
      {isFirstRender.current ? null : spinProps.spinning ? null : mergeHasData ? (
        children
      ) : (
        <ComEmpty {...emptyProps} />
      )}
    </Spin>
  );
};

export function ComEmpty(props: EmptyProps) {
  return (
    <Empty
      image={imgEmpty}

      imageStyle={{height: 180}}
      {...props}
      className={styles["root-empty"]}></Empty>
  );
}

export default SpinLoading;
