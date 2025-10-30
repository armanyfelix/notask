import { useEffect, useState } from "react";
import { useAccountStore, useSidebarsStore } from "@/utils/zustand";
import supabase from "@/utils/supabase";
import { twMerge } from "tailwind-merge";
import { addImageUrl } from "@/helpers/images";
import { Button } from "react-aria-components";
import ToolbarPlugin from "./editor/plugins/ToolbarPlugin";
import ToolsPlugin from "./editor/plugins/ToolsPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function Sidebar() {
  const { account } = useAccountStore();
  const { rightSidebarOpen, setRightSidebarOpen } = useSidebarsStore();

  const [editor] = useLexicalComposerContext();

  const [track, setTrack] = useState(false);
  const [width, setWidth] = useState(350);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [activeEditor, setActiveEditor] = useState(editor);

  const onToggle = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  async function getFavorites() {
    if (account) {
      const { data } = await supabase
        .from("lists")
        .select("*")
        .eq("favorite", true);
      if (data) {
        const withImages = await addImageUrl(data);
        return withImages;
      }
    }
  }

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (track) {
  //       const newWidth = Math.min(Math.max(e.clientX, 1120), 1510);
  //       setWidth(newWidth);
  //     }
  //   };
  //   const handleMouseUp = () => {
  //     console.log("right mouse up", track);
  //     if (track) setTrack(false);
  //   };
  //   if (track) {
  //     window.addEventListener("mousemove", handleMouseMove);
  //     window.addEventListener("mouseup", handleMouseUp);
  //   }
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [track]);

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <aside className="flex items-start">
      <div
        style={{
          marginRight: `${rightSidebarOpen ? -width - 12 : 0}px`,
          transition: "0.5s ease",
        }}
        className="select-none absolute shadow-md md:static md:shadow-none hidden sm:flex"
      >
        <div
          className={twMerge(
            "flex transition-all duration-500 bg-base-200",
            rightSidebarOpen
              ? "translate-x-full"
              : "min-w-[120px]  max-w-[510px]",
          )}
        >
          <div
            onMouseDown={() => setTrack(true)}
            className="w-1.5 h-screen bg-base-200 active:bg-secondary hover:bg-secondary transition-colors cursor-col-resize"
          ></div>
          <div
            style={{ width: `${width}px` }}
            className={twMerge(
              "relative min-w-[120px] max-w-[510px] h-[calc(100vh-40px)] flex mr-1.5 overflow-auto flex-col justify-between",
            )}
          >
            <div className="tabs tabs-xs tabs-box">
              <label className="tab">
                <input type="radio" name="my_tabs" />
                <span className="icon-[tabler--messages] size-6"></span>
              </label>
              <div className="tab-content bg-base-100 border-base-300 p-6">
                Tab content 1
              </div>

              <label className="tab">
                <input type="radio" name="my_tabs" />
                <span className="icon-[tabler--share-2] size-6"></span>
              </label>
              <div className="tab-content bg-base-100 border-base-300 p-6">
                Tab content 2
              </div>

              <label className="tab">
                <input type="radio" name="my_tabs" />
                <span className="icon-[tabler--text-resize] size-6"></span>
              </label>
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <ToolsPlugin
                  editor={editor}
                  activeEditor={activeEditor}
                  setActiveEditor={setActiveEditor}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
              </div>
            </div>
            <div className="fixed right-0 select-none z-50 w-10 flex flex-col space-y-4 items-center justify-center h-[calc(100vh-66px)]">
              <Button
                onClick={() => onToggle()}
                className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
                data-tip="Comments"
              >
                <span className="icon-[tabler--messages] size-8"></span>
              </Button>
              <Button
                className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
                data-tip="Comments"
              >
                <span className="icon-[tabler--markdown] size-8"></span>
              </Button>
              <Button
                className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
                data-tip="Comments"
              >
                <span className="icon-[tabler--share-2] size-8"></span>
              </Button>
              <Button
                className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
                data-tip="Comments"
              >
                {/*<span className="icon-[tabler--lock-filled] size-8"></span>*/}
                <span className="icon-[tabler--lock-open] size-8"></span>
              </Button>
              <Button
                className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
                data-tip="Comments"
              >
                <span className="icon-[tabler--text-resize] size-8"></span>
              </Button>
            </div>
            <div className="mt-auto">Footer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
