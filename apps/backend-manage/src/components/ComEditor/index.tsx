import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, useRef } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { message } from "antd";
import { reqUploadFile } from "@/api/base";

interface ComEditorProps {
  value?: any;
  onChange?: (value: any) => void;
  height?: number;
}
const ComEditor = (props: ComEditorProps) => {
  const { height, value, onChange } = props;

  const [html, setHtml] = useState(value);
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  const uploadImg = async (file: any, insertFn: any) => {
    if (file.size > 2 * 1024 * 1024) {
      message.warning("图片大小不能超过2MB");
      return;
    }
    const params = new FormData();
    params.append("file", file);
    const res = await reqUploadFile(params);
    if (res.code === 200) {
      insertFn(res.data.url);
    } else {
      message.error(res.message);
    }
  };
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    placeholder: "请输入内容...",
    // 取消选中后的悬浮菜单
    hoverbarKeys: {
      link: {
        menuKeys: [],
      },
      pre: {
        menuKeys: [],
      },
      table: {
        menuKeys: [],
      },
      text: {
        menuKeys: [],
      },
    },
    MENU_CONF: {
      uploadImage: {
        customUpload: uploadImg, // 自定义上传图片
      },
    },
  };

  // 记录首次执行导致填充为 `<p><br></p>` 问题
  const isFirstRef = useRef(true);
  const handleEditorChange = (editor: IDomEditor) => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    const newHtml = editor.getHtml();
    onChange?.(newHtml);
    if (!onChange) {
      setHtml(newHtml);
    }
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  // 传入value值，用自身的，防止上面多次更新。解决使用多次，导致组件不会重新渲染问题
  useEffect(() => {
    setHtml(value);
    if (html !== undefined) {
      onChange?.(value);
    }
  }, [value]);

  return (
    <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleEditorChange}
        mode="default"
        style={{ height: height || 300, overflowY: "hidden" }}
      />
    </div>
  );
};

export default React.memo(ComEditor);
