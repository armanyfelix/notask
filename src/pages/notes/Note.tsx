import { useCallback, useEffect, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./editorTools";
import exampleData from "./exampleData";
import { save } from "@tauri-apps/plugin-dialog";

const ReactEditorJS = createReactEditorJS();

export default function Note() {
  const editorCore = useRef<any>(null);

  const [data, setData] = useState(exampleData);

  const handleInitialize = useCallback((instance: any) => {
    instance._editorJS.isReady
      .then(() => {
        console.log("✅ Editor ready!");
        editorCore.current = instance;
      })
      .catch((err: any) => console.error("❌ Editor init error:", err));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editorCore.current) {
      console.log("Editor not ready for save");
      return;
    }
    try {
      const savedData = await editorCore.current.save();
      setData(savedData);
      console.log("💾 Saved data:", savedData);
    } catch (error) {
      console.error("Save error:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (editorCore.current?.destroy) {
        editorCore.current.destroy();
        editorCore.current = null;
      }
    };
  }, []);

  return (
    <div className="editor-container bg-base-300 selection:bg-base-100">
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        onChange={handleSave}
        defaultValue={data}
        placeholder="Start writing..."
      />
    </div>
  );
}
