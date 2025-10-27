import { useState, useRef, useEffect } from "react";
import { Button, Input } from "react-aria-components";
import { Link, useNavigate } from "react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, dirname, documentDir } from "@tauri-apps/api/path";
import { mkdir } from "@tauri-apps/plugin-fs";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import WindowButtons from "@/layout/WindowButtons";
import { Store } from "@tauri-apps/plugin-store";

interface CreateHubProps {}

export default function CreateHub({}: CreateHubProps) {
  const [createHub, setCreateHub] = useState<boolean>(false);
  const [newHubName, setNewHubName] = useState<string>("");
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const navigate = useNavigate();

  const window = getCurrentWindow();

  const onSelectLocation = async () => {
    const location = await open({
      directory: true,
      defaultPath: await documentDir(),
    });
    if (location !== null) {
      return location;
    }
  };

  const onBrowseLocation = async () => {
    const location = await onSelectLocation();
    if (location) {
      setSelectedLocation(location);
    }
  };

  const onOpenFolder = async () => {
    const location = await onSelectLocation();
  };

  const onQuickStart = async () => {
    try {
      const newDir = await mkdir("zaghub", { baseDir: BaseDirectory.Document });
      console.log(newDir);
    } catch (err) {}
  };

  const onCreateHub = async () => {
    if (!newHubName || !isValidName) {
      setAlert("Please, pick a valid hub name");
    } else if (!selectedLocation) {
      setAlert("Please, select a location");
    } else {
      try {
        await mkdir(`${selectedLocation}/${newHubName}`);
        const store = await Store.load("hubs.json");
        await store.set(newHubName, selectedLocation);
        console.log(store);
        navigate("/");
      } catch (error: any) {
        setAlert(error);
      }
    }
  };

  const windowSize = async () => {
    await window.setSize(new LogicalSize(600, 560));
    await window.setMaximizable(false);
    await window.setResizable(false);
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

  useEffect(() => {
    setTimeout(() => {
      setAlert("");
    }, 6000);
  }, [alert]);

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
      <div className="p-5">
        <div slot="title" className="pb-10 pt-5">
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
              <Button className="btn" onPress={() => onOpenFolder()}>
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
              <div className="flex items-start justify-between gap-x-10">
                <div>
                  <div>Hub name</div>
                  <div className="text-xs font-semibold text-nowrap opacity-70">
                    Pick a name for your new hub
                  </div>
                </div>
                <fieldset>
                  <Input
                    className={`input ${!isValidName ? "input-error" : ""}`}
                    type="text"
                    required
                    placeholder="Hub name"
                    maxLength={60}
                    minLength={1}
                    value={newHubName}
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setNewHubName(value);
                      const hasInvalidChars = /[/\\]/.test(value);
                      const endsWithDot = /\.$/.test(value);
                      const isValid = value.length > 0 && !hasInvalidChars && !endsWithDot;
                      setIsValidName(isValid);
                    }}
                  />
                  {!isValidName && (
                    <div className="mt-0.5 text-error text-xs">Enter a valid name.</div>
                  )}
                </fieldset>
              </div>
              <div className="divider gap-0"></div>
              <div className="flex items-center justify-between gap-x-10">
                <div>
                  <div>Location</div>
                  <div className="text-xs font-semibold opacity-70">
                    {selectedLocation ? (
                      <p>
                        Your new hub will be placed in:{" "}
                        <span className="text-primary">{selectedLocation}</span>
                      </p>
                    ) : (
                      "Pick a place to put your new hub"
                    )}
                  </div>
                </div>
                <Button className="btn" onPress={() => onBrowseLocation()}>
                  Browse
                </Button>
              </div>
            </div>
            <div className="text-center mt-10">
              <Button className="btn btn-primary btn-wide" onPress={() => onCreateHub()}>
                Create Hub
              </Button>
            </div>
          </div>
        )}
      </div>
      {alert && (
        <div role="alert" className="alert absolute text-xs alert-error top-10 right-3">
          <span>{alert}</span>
        </div>
      )}
    </main>
  );
}
