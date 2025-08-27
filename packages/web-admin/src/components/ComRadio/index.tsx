import React from "react"
import { Button, RadioProps, SelectProps, Space } from "antd"
import styles from "./index.module.scss"

// type RadioButtonSize = ButtonProps["size"] | "default";
interface RenderButtonsProps extends Omit<RadioProps, "onChange"> {
  options: SelectProps["options"]
  value?: string
  onChange?: (value: string) => void
  fieldNames?: SelectProps["fieldNames"]
  // size?: RadioButtonSize;
}

const ComRadio: React.FC<RenderButtonsProps> = props => {
  const { onChange, value, options, fieldNames } = props
  const fieldValue = fieldNames?.value || "value"
  const fieldLabel = fieldNames?.label || "label"
  return (
    <Space wrap className={styles.root}>
      {options?.map((item: any, index) => {
        const isPrimary = value === item[fieldValue]
        return (
          <Button
            key={index}
            className={["btn-option", isPrimary ? "btn-option" : ""].join(" ")}
            type={isPrimary ? "primary" : "default"}
            onClick={() => onChange?.(item[fieldValue])}>
            {item[fieldLabel]}
          </Button>
        )
      })}
    </Space>
  )
}

// type SizeType = ButtonProps["size"] | "default";
// interface ComButtonProps extends Omit<ButtonProps, "size"> {
//   size?: SizeType;
// }
// const ComButton: React.FC<ComButtonProps> = (props) => {
//   const { size = "default", ...rest } = props;
//   return <Button {...rest} size={size} />;
// };
export default ComRadio
