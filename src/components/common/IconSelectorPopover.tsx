import {
  Button,
  DialogTrigger,
  Popover,
  PopoverProps,
  Tab,
  TabList,
  Tabs,
} from "react-aria-components";
import CloseIcon from "@/assets/svgs/close.svg?react";
import { lazy, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
const UploadImage = lazy(() => import("./UploadImage"));
const Icons = lazy(() => import("./Icons"));

interface Props extends Omit<PopoverProps, "children"> {
  selectedIcon: any;
  setSelectedIcon: (value: any) => void;
}

export default function AddIconPopover({
  selectedIcon,
  setSelectedIcon,
  ...props
}: Props) {
  return (
    <DialogTrigger {...props}>
      <Button
        className={`btn btn-square join-item border border-base-content/20`}
        style={{ color: selectedIcon.color }}
      >
        {selectedIcon?.image && selectedIcon?.url && (
          <div className="indicator">
            <Button
              className="btn btn-circle btn-error indicator-item btn-xs text-error-content"
              onPress={() => {
                setSelectedIcon({});
              }}
            >
              <CloseIcon className="h-3 w-3" />
            </Button>
            <div className="w-8 h-8">
              <img
                src={selectedIcon.url}
                width={48}
                height={48}
                alt=""
                className="rounded-btn w-8 h-8"
              />
            </div>
          </div>
        )}
        {selectedIcon?.name && (
          <Icon
            icon={`tabler:${selectedIcon.name}`}
            width="2em"
            height="2em"
            // style={{ backgroundColor: selectedIcon.value?.color }}
          ></Icon>
        )}
        {!selectedIcon?.name && !selectedIcon?.url && (
          <span className="icon-[solar--planet-bold-duotone] h-7 w-7"></span>
        )}
      </Button>
      <Popover className="dialog card card-compact max-w-xl overflow-auto">
        <div className="card-body items-center justify-center">
          <Tabs>
            <TabList
              aria-label="Select what you want to create"
              className="tabs tabs-bordered"
            >
              <Tab id="icon" className="tab capitalize selected:tab-active">
                Icon
              </Tab>
              <Tab id="file" className="tab capitalize selected:tab-active">
                Upload file
              </Tab>
            </TabList>
            <Suspense
              fallback={
                <div className="flex justify-center md:w-72 md:py-8">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              }
            >
              <Icons
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
              />
            </Suspense>
            <UploadImage
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
            />
          </Tabs>
        </div>
      </Popover>
    </DialogTrigger>
  );
}
