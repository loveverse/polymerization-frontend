import React, { PropsWithChildren } from "react";
import styles from "./index.module.scss";

interface TitleProps {
  title: string;
  style?: React.CSSProperties;
  icon?: string;
  marginBottom?: number;
}
const ComTitle: React.FC<PropsWithChildren<TitleProps>> = (props) => {
  const { marginBottom = 20, title, icon, style } = props;
  return (
    <div className={styles["com_title_wrapper"]} style={{ marginBottom, ...style }}>
      <div className="title-left">
        {icon ? <img src={icon} alt="" /> : <div className="line"></div>}
        <span>{title}</span>
      </div>
      {props.children}
    </div>
  );
};
export default ComTitle;
