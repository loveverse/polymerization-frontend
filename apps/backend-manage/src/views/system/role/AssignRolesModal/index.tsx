import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Avatar, Checkbox, Modal, ModalProps, message } from "antd";
import { reqAssignRoleToUser, reqNoAssignUserList } from "@/api/system";
import { UserPageRes } from "@/api/user/types";
import styles from "./index.module.scss";

interface AssignRolesModalProps extends ModalProps {
  roleId: string;
  callback: () => void;
}

const AssignRolesModal = forwardRef<ChildRef, AssignRolesModalProps>(function Child(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      setConfirmLoading,
    };
  });
  const { roleId, callback, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [userList, setUserList] = useState<UserPageRes[]>([]);
  const fetchNoAssignUserList = async () => {
    const res = await reqNoAssignUserList({ id: roleId });
    if (res.code === 200) {
      const list = res.data.map((item) => {
        item.checked = false;
        return item;
      });
      setUserList(list);
    } else {
      message.error(res.message);
    }
  };
  const userAssignRole = async () => {
    const userIds: string[] = [];
    userList.forEach((item) => {
      if (item.checked) {
        userIds.push(item.id);
      }
    });
    const res = await reqAssignRoleToUser({
      roleId,
      userIds,
    });
    if (res.code === 200) {
      setShow(false);
      message.success("分配角色成功");
      callback();
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (show) {
      fetchNoAssignUserList();
    }
  }, [show]);

  return (
    <Modal
      {...modalProps}
      open={show}
      width={934}
      rootClassName={styles["assign-roles-dia"]}
      confirmLoading={confirmLoading}
      onCancel={() => setShow(false)}
      onOk={() => {
        userAssignRole();
      }}>
      <div className="teacher-wrapper">
        <ul className="teacher-tree">
          {userList.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  const cloneData = userList.slice();
                  cloneData[index].checked = !item.checked;
                  setUserList(cloneData);
                }}>
                <Checkbox checked={item.checked} />
                <div className="user-info">
                  <Avatar src={item.headImg} />
                  <span className="user-name">{item.username}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="personnel-info">
          <ul className="teacher-list">
            {userList
              .filter((k) => k.checked)
              .map((item) => {
                return (
                  <li key={item.id} className="teacher-item">
                    <Avatar src={item.headImg} className="avator" />
                    <p className="teacher-name">{item.username}</p>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </Modal>
  );
});

export default AssignRolesModal;
