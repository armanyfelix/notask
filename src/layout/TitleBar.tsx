import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export default function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();
  const handleClose = () => appWindow.close();
  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = async () => {
    appWindow.toggleMaximize();
    const maximized = await getCurrentWindow().isMaximized();
    if (maximized) {
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    function handleResize() {
      appWindow.isMaximized().then((newState) => setIsMaximized(newState));
    }
    handleResize();

    const unlisten = appWindow.listen("tauri://resize", async () => {
      handleResize();
    });
    return () => {
      unlisten.then((u) => u());
    };
  }, []);

  return (
    <div className="sticky top-0">
      <div className="flex items-start bg-base-300">
        <div
          data-tauri-drag-region
          id="titlebar"
          onBlurCapture={() => console.log("like, actualy?")}
          className="w-full h-full border-2 border-red-400"
        >
          {" "}
          da
        </div>
        <button
          className="btn btn-square btn-sm cursor-default"
          onClick={handleMinimize}
        >
          <span className="icon-[tabler--minus] w-4 h-4"></span>
        </button>
        <button
          className="btn btn-square btn-sm cursor-default"
          onClick={handleMaximize}
        >
          {isMaximized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              style={{ transform: "scaleX(-1)" }}
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z" />
                <path d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" />
              </g>
            </svg>
          ) : (
            <span className="icon-[tabler--crop-5-4] w-4 h-4"></span>
          )}
        </button>
        <button
          className="btn btn-square btn-sm hover:bg-red-500 cursor-default"
          onClick={handleClose}
        >
          <span className="icon-[tabler--x] w-4 h-4"></span>
        </button>
      </div>
    </div>
  );
}
