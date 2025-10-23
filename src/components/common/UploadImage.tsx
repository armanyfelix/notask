import { imageUpload } from "@/helpers/images";
import {
  Button,
  DropZone,
  FileDropItem,
  FileTrigger,
  TabPanel,
  Text,
} from "react-aria-components";

interface Props {
  selectedIcon: any;
  setSelectedIcon: (value: any) => void;
}

export default function UploadImage({ selectedIcon, setSelectedIcon }: Props) {
  const handleImageUpload = async (e: any) => {
    const res: any = await imageUpload(e);
    if (res && res.error) {
    } else if (res) {
      setSelectedIcon({
        image: res.image,
        url: res.url,
      });
    }
  };

  return (
    <TabPanel id="file">
      <div className="mt-4">
        <DropZone
          className="border-2 border-dotted border-opacity-50 p-10 text-center drop-target:bg-secondary/50 drop-target:text-secondary-content md:w-96"
          onDrop={(e) => {
            e.items.filter((file) => file.kind === "file") as FileDropItem[];
            handleImageUpload(e);
          }}
        >
          <FileTrigger
            acceptedFileTypes={["image/*"]}
            onSelect={(e) => handleImageUpload(e)}
          >
            <Button className="btn btn-sm mx-auto">Select a file</Button>
          </FileTrigger>
          <Text slot="label" className="mt-2 block text-center text-xs">
            {selectedIcon?.name || "Drop file here"}
          </Text>
        </DropZone>
      </div>
    </TabPanel>
  );
}
