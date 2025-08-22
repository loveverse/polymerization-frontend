import React, {useState, useEffect} from 'react';
import {Tree} from 'antd';
import type {TreeProps} from 'antd';
import type {DataNode} from 'antd/es/tree';

interface EnhancedTreeProps extends TreeProps {
  treeData: any[];
  value: React.Key[];
  onChange?: (val: React.Key[]) => void;
}

const EnhancedTree: React.FC<EnhancedTreeProps> = ({treeData, value, onChange, ...treeProps}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (value.length && treeData.length) {
      const {checked, halfChecked} = splitCheckedAndHalf(value, treeData);
      setCheckedKeys(checked);
      setHalfCheckedKeys(halfChecked);
    }
  }, [value, treeData]);

  const handleCheck: TreeProps['onCheck'] = (checked, info) => {
    const checkedArr = Array.isArray(checked) ? checked : checked.checked;
    const halfArr = info.halfCheckedKeys || [];

    setCheckedKeys(checkedArr);
    setHalfCheckedKeys(halfArr);

    // ✅ 包含全选 + 半选的值
    onChange?.([...checkedArr, ...halfArr]);
  };

  // 🔁 回显拆分
  const splitCheckedAndHalf = (value: React.Key[], data: DataNode[]) => {
    const checked: React.Key[] = [];
    const halfChecked: React.Key[] = [];

    for (const key of value) {
      const node = findNodeByKey(data, key);
      if (!node) continue;

      const childrenKeys = getAllChildrenKeys(node);
      if (!node.children || node.children.length === 0) {
        checked.push(key); // 叶子节点
      } else {
        const allChildrenSelected = childrenKeys.every((ck) => value.includes(ck));
        if (allChildrenSelected) {
          checked.push(key);
        } else {
          halfChecked.push(key);
        }
      }
    }

    return {checked, halfChecked};
  };

  const findNodeByKey = (nodes: DataNode[], key: React.Key): DataNode | null => {
    for (const node of nodes) {
      if ((node as any).id === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const getAllChildrenKeys = (node: DataNode): React.Key[] => {
    if (!node.children) return [];
    return node.children.flatMap((child) => [(child as any).id, ...getAllChildrenKeys(child)]);
  };

  return (
    <Tree
      {...treeProps}
      checkable
      treeData={treeData}
      checkedKeys={{checked: checkedKeys, halfChecked: halfCheckedKeys}}
      onCheck={handleCheck}
    />
  );
};
export default EnhancedTree
