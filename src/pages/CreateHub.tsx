import { useState, useRef, useEffect } from "react";
import { Button, Input } from "react-aria-components";
import { Link } from "react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, documentDir } from "@tauri-apps/api/path";
import { mkdir } from "@tauri-apps/plugin-fs";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import WindowButtons from "@/layout/WindowButtons";

interface CreateHubProps {}

export default function CreateHub({}: CreateHubProps) {
  const [createHub, setCreateHub] = useState<boolean>(false);
  const [newHubName, setNewHubName] = useState<boolean>(false);

  const window = getCurrentWindow();

  const onSelectLocation = async () => {
    const selected = await open({
      directory: true,
      defaultPath: await documentDir(),
    });
    if (selected !== null) {
      return selected;
    }
  };

  const onQuickStart = async () => {
    try {
      const newDir = await mkdir("zaghub", { baseDir: BaseDirectory.Document });
      console.log(newDir);
    } catch (err) {}
  };

  const windowSize = async () => {
    await window.setSize(new LogicalSize(600, 560));
    await window.setMaximizable(false);
    await window.setResizable(false);
    console.log("window shit size");
  };

  const restoreWindow = async () => {
    await window.setMaximizable(true);
    await window.setResizable(true);
  };

  useEffect(() => {
    windowSize();

    return () => {
      restoreWindow();
    };
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      <div className="sticky top-0 right-0 left-0 h-8 bg-base-100 z-999999 flex items-center">
        <div
          data-tauri-drag-region
          className="w-full h-8 text-center inline-flex justify-center items-center"
        >
          <span className="pointer-events-none">Getting Started</span>
        </div>
        <WindowButtons noMaximizable />
      </div>
      <div className=" p-5 md:p-12">
        <div slot="title" className="pb-10">
          <img src="/logo_orange.png" alt="zag" className="w-48 mx-auto" />
        </div>
        {!createHub ? (
          <div className="">
            <div className="flex items-center justify-between gap-x-10">
              <div>
                <div>Create new hub</div>
                <div className="text-xs font-semibold opacity-70">
                  Create a new repository under a folder
                </div>
              </div>
              <Button className="btn" onPress={() => setCreateHub(true)}>
                Create
              </Button>
            </div>
            <div className="divider"></div>
            <div className="flex items-center justify-between gap-x-10">
              <div>
                <div>Open folder as hub</div>
                <div className="text-xs font-semibold opacity-70">
                  Choose an existing folder to open as a hub
                </div>
              </div>
              <Button className="btn" onPress={() => onSelectLocation()}>
                Open
              </Button>
            </div>
            <div className="divider"></div>

            <div className="flex items-center justify-between gap-x-10">
              <div>
                <div>Open hub from your Zag account</div>
                <div className="text-xs font-semibold opacity-70">
                  Set up as synced hub with existing remote hub
                </div>
              </div>
              <Link to="/signin" className="btn">
                Sign in
              </Link>
            </div>
            <div className="text-center mt-10">
              <Button className="btn btn-primary btn-wide" onPress={() => onQuickStart()}>
                Quick Start
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Button className="btn btn-ghost" onPress={() => setCreateHub(false)}>
                <span className="icon-[solar--arrow-left-line-duotone]"></span>
                Back
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-x-10">
                <div>
                  <div>Hub name</div>
                  <div className="text-xs font-semibold text-nowrap opacity-70">
                    Pick a name for your new hub
                  </div>
                </div>
                <Input
                  className="input"
                  placeholder="Hub name"
                  onChange={(e: any) => setNewHubName(e.target.value)}
                />
              </div>
              <div className="divider"></div>
              <div className="flex items-center justify-between gap-x-10">
                <div>
                  <div>Location</div>
                  <div className="text-xs font-semibold opacity-70">
                    Pick a place to put your new hub
                  </div>
                </div>
                <button className="btn">Browse</button>
              </div>
            </div>
            <div className="text-center mt-10">
              <Button className="btn btn-primary btn-wide">Create Hub</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
