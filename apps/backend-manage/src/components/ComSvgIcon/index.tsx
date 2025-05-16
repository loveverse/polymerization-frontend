import React, { useEffect, useState } from "react";
import Icon from "@ant-design/icons";
import "./index.scss";

/**
 * 使用前先安装
 * pnpm i babel-loader @svgr/webpack svgo-loader -D
 */
let modules: string[] = [];
try {
  const requireContext = require.context("../../assets/svgs", true, /\.svg$/);
  modules = requireContext.keys().map((modulePath) => {
    const moduleName = modulePath.replace(/\.\/(.*)\.\w+$/, "$1");
    return moduleName;
  });
} catch (error) {
  console.error(error);
}

interface SvgIconProps {
  alias: string;
}

const ComSvgIcon = (props: SvgIconProps) => {
  const [dynamicComponent, setDynamicComponent] = useState<any>("");
  const loadComponent = async () => {
    try {
      if (modules.includes(props.alias)) {
        const { default: Component } = await import(`@/assets/svgs/${props.alias}.svg`);
        setDynamicComponent(() => Component);
      } else {
        console.error(props.alias + "not found");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadComponent();
  }, []);
  return dynamicComponent ? <Icon component={dynamicComponent} className="comicon" /> : null;
};

export default ComSvgIcon;
