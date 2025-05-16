import React, { Key, useState } from "react";
import { Modal, DatePicker, ModalProps, Flex, TimeRangePickerProps, message } from "antd";
import { reqUpdateSchoolsValid } from "@/api/school";
const { RangePicker } = DatePicker;

export interface UpdateSchoolsValidModalProps extends ModalProps {
  selectKeys: Key[];
  callback(): void;
  closeOpen: () => void;
}
const UpdateSchoolsValidModal = (props: UpdateSchoolsValidModalProps) => {
  const { selectKeys, closeOpen, callback, ...modalProps } = props;
  const [times, setTimes] = useState<TimeRangePickerProps["value"]>(null);
  const updateSchoolsValid = async () => {
    if (!Array.isArray(times)) {
      message.warning("请选择启用有效期！");
      return;
    }
    const timestamps: number[] = times.map((k) => k?.valueOf() || 0);
    const res = await reqUpdateSchoolsValid({
      ids: selectKeys as string[],
      validStartTime: timestamps[0],
      validEndTime: timestamps[1],
    });
    if (res.code === 200) {
      closeOpen();
      callback();
    } else {
      message.error(res.message);
    }
  };
  return (
    <Modal
      {...modalProps}
      title="批量修改启用有效时间"
      onOk={() => {
        updateSchoolsValid();
      }}
      onCancel={closeOpen}>
      <Flex justify="center">
        <div>
          <p>系统启用有效期：</p>
          <RangePicker
            value={times}
            onChange={(date) => {
              setTimes(date);
            }}
          />
        </div>
      </Flex>
    </Modal>
  );
};

export default UpdateSchoolsValidModal;
