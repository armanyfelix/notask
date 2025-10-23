import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import {
  Button,
  Input,
  OverlayArrow,
  TabPanel,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import { useEffect, useState } from "react";
import { AutoSizer, Grid } from "react-virtualized";
import colors from "@/data/colors.json";

export default function Icons({ selectedIcon, setSelectedIcon }: any) {
  const [icons, setIcons] = useState<any>(null);
  const [allIcons, setAllIcons] = useState<any>([]);
  const getIcons = async () => {
    fetch("/src/data/icons-tabler.json")
      .then((response) => response.json())
      .then((data) => {
        setIcons(data);
        setAllIcons(data);
      });
  };

  const onSearch = (e: any) => {
    const value = e.target.value;
    if (value === "") {
      setIcons(allIcons);
    }
    const filteredData = icons?.filter((icon: any) => {
      if (value === "") {
        return icon;
      } else {
        return icon.toLowerCase().includes(value);
      }
    });
    setIcons(filteredData);
  };
  useEffect(() => {
    getIcons();
  }, []);

  return (
    <TabPanel id="icon" className="min-h-72">
      <div className="my-3">
        <div className="max-w-96 pb-1 text-center">
          {colors.map((c: string) => (
            <Button
              className="m-1 h-6 w-6 rounded-full"
              style={{ backgroundColor: c }}
              onPress={() => setSelectedIcon({ ...selectedIcon, color: c })}
            ></Button>
          ))}
        </div>
        <Input
          className="input input-sm w-full"
          placeholder="search"
          onInput={onSearch}
        />
      </div>
      {icons.value && (
        <AutoSizer>
          {({ width, height }: any) => (
            <Grid
              cellRenderer={cellRenderer(icons, selectedIcon, setSelectedIcon)}
              columnCount={10}
              columnWidth={38}
              style={{ color: selectedIcon.color }}
              height={height}
              rowCount={icons?.length}
              rowHeight={38}
              width={width}
              selectedIcon={selectedIcon}
            />
          )}
        </AutoSizer>
      )}
    </TabPanel>
  );
}

const cellRenderer =
  (icons: any, selectedIcon: any, setSelectedIcon: any) =>
  ({ key, rowIndex, columnIndex, style }: any) => {
    const index = rowIndex * 10 + columnIndex;

    return (
      <div key={key} style={style}>
        <IconItem
          icon={icons?.[index]}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      </div>
    );
  };

const IconItem = ({ icon, selectedIcon, setSelectedIcon }: any) => {
  return (
    <TooltipTrigger>
      <Button
        className="btn btn-square btn-ghost btn-sm"
        style={{ color: selectedIcon.color }}
        onPress={() =>
          setSelectedIcon({
            color: selectedIcon.color,
            name: icon,
          })
        }
      >
        <Icon icon={`tabler:${icon}`} width="1.9em" height="1.9em" />
      </Button>
      <Tooltip className="rounded-box bg-base-100 px-2 py-1 text-sm">
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8" className="fill-base-100">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {icon}
      </Tooltip>
    </TooltipTrigger>
  );
};
