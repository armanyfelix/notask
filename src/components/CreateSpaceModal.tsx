import CloseIcon from "../assets/svgs/close.svg?react";
import { useContext, useState } from "react";
import { imageUpload } from "../helpers/images";
import supabase from "../utils/supabase";
import { AlertContext } from "../context/AlertContext";
import {
  Button,
  Color,
  Dialog,
  DropZone,
  FileDropItem,
  FileTrigger,
  Heading,
  Modal,
  Text,
} from "react-aria-components";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  spaces: any;
  setSpaces: (value: any) => void;
  accountId: any;
}

export default function CreateSpaceModal({
  open,
  setOpen,
  spaces,
  setSpaces,
  accountId,
}: Props) {
  const [step, setStep] = useState<number>(1);
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<Color | null>(null);
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);

  const notify = useContext(AlertContext);

  const onClose = () => {
    setOpen(false);
    setStep(1);
    setName("");
    setDescription("");
    setColor(null);
    setOpenPicker(false);
    setImage(null);
    setImageUrl(null);
  };

  const handleImageUpload = async (e: any) => {
    console.log("e :>> ", e);
    const res: any = await imageUpload(e);
    if (res && res.error) {
    } else if (res) {
      setImage(res.image);
      setImageUrl(res.url);
    }
  };

  const onCreateSpace = async () => {
    if (!name) {
      return;
    }
    let iconPath = null;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error } = await supabase.storage
        .from("spaces_icons")
        .upload(filePath, image);
      if (error) {
        notify(
          "error",
          "The avatar could not be saved, please try again later.",
        );
      } else {
        iconPath = data.path;
      }
    }

    const { data, error } = await supabase
      .from("spaces")
      .insert([
        {
          name: name.trim(),
          description: description,
          color: color,
          image_url: iconPath,
          account: accountId,
        },
      ])
      .select()
      .single();

    if (error) {
      notify("error", "Error creating the space, try again later");
    } else {
      notify("success", "Space created");
      setSpaces([
        ...spaces,
        {
          ...data,
          image_url: image ? URL.createObjectURL(image) : null,
        },
      ]);
      onClose();
    }
  };

  return (
    <Modal isDismissable isOpen={open} onOpenChange={onClose}>
      <Dialog className="card card-compact h-min max-h-[85vh] w-fit bg-neutral/70 backdrop-blur-xl">
        <div className="card-body">
          <Heading slot="title" className="card-title">
            {step > 1 && (
              <Button
                className={`btn btn-square btn-ghost btn-sm`}
                onPress={() => setStep(step - 1)}
              >
                <span className="icon-[solar--arrow-left-outline] h-5 w-5"></span>
              </Button>
            )}

            <h1>Create a new space</h1>
          </Heading>
          {step === 1 && (
            <FirstStep
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              image={image}
              setImage={setImage}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              step={step}
              setStep={setStep}
              handleImageUpload={handleImageUpload}
            />
          )}
          {step === 2 && <SecondStep handleImageUpload={handleImageUpload} />}
          {step === 3 && (
            <ThirdStep
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
            />
          )}
          <div className="card-actions justify-center">
            {step >= 3 ? (
              <button
                className="btn btn-primary btn-block mt-6 px-6 text-xl"
                disabled={!name}
                onClick={() => onCreateSpace()}
              >
                Create Space
              </button>
            ) : (
              <button
                disabled={!name}
                className="btn btn-primary btn-block px-6 text-xl"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </Dialog>
    </Modal>
  );
}

const FirstStep = ({
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
  imageUrl,
  setImageUrl,
  step,
  setStep,
  handleImageUpload,
}: any) => {
  return (
    <div id="1" className="flex-col">
      <div className="my-8">
        <div className="flex items-center justify-between px-8">
          {typeof imageUrl === "string" && imageUrl ? (
            <div className="indicator">
              <Button
                className="btn btn-circle btn-error indicator-item btn-xs text-error-content"
                onPress={() => {
                  setImage(null);
                  setImageUrl(null);
                }}
              >
                <CloseIcon className="h-3 w-3" />
              </Button>
              <img src={imageUrl} width={64} height={64} alt="" />
            </div>
          ) : (
            <span className="icon-[solar--planet-bold-duotone] h-16 w-16"></span>
          )}
          <div className="">
            <DropZone
              onDrop={(e) => {
                let files = e.items.filter(
                  (file) => file.kind === "file",
                ) as FileDropItem[];
                console.log("files :>> ", files);
              }}
              className="rounded-btn border-2 border-dotted border-opacity-50 p-5 drop-target:bg-secondary/50 drop-target:text-secondary-content"
            >
              <FileTrigger
                acceptedFileTypes={["image/*"]}
                onSelect={(e) => handleImageUpload(e)}
              >
                <Button className="btn btn-sm">Select a file</Button>
              </FileTrigger>
              <Text slot="label" className="mt-2 block text-center text-xs">
                {image?.name || "Drop file here"}
              </Text>
            </DropZone>
          </div>
        </div>
        <div className="w-[320px]"></div>
      </div>
      <input
        className="input mt-8 w-full font-semibold !outline-none"
        placeholder="Name"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
        onKeyUp={(e) => e.key === "Enter" && name && setStep(2)}
      />
      <textarea
        className="textarea mt-3 w-full"
        rows={3}
        placeholder="Description (optional)"
        value={description}
        onInput={(e) => setDescription(e.currentTarget.value)}
        onKeyPress={(e) => e.key === "Enter" && name && setStep(2)}
      ></textarea>
    </div>
  );
};

const SecondStep = ({ handleImageUpload }: any) => {
  return (
    <div>
      <h1 className="card-title">Icon</h1>
    </div>
  );
};

const ThirdStep = ({ name, setName, description, setDescription }: any) => {
  return (
    <div className="w-full flex-col">
      <h1 className="card-title text-3xl">Space settings</h1>
      <p>You can change the space options letter</p>
      <ul className="mt-6 space-y-3 text-xl md:w-[40rem]">
        <li className="rounded-btn border border-neutral px-3 py-2 text-center">
          <div className="flex justify-between">
            <h3 className="fon-semibold">Name:</h3>
            <input
              className="ml-5 bg-transparent text-right text-xl font-semibold outline-none placeholder:opacity-50"
              placeholder="Space name"
              value={name}
              onInput={(e) => setName(e.currentTarget.value)}
            />
          </div>
          {!name && (
            <span className="text-sm text-error">
              The space name it's required
            </span>
          )}
        </li>
        <li className="flex justify-between rounded-btn border border-neutral px-3 py-2 text-right">
          <h3 className="">Description:</h3>
          <textarea
            className="ml-5 w-full bg-transparent text-right text-base tracking-tighter outline-none"
            rows={2}
            value={description}
            onInput={(e) => setDescription(e.currentTarget.value)}
          ></textarea>
        </li>
        <li className="flex max-w-2xl justify-between rounded-btn border border-neutral px-3 py-2 text-right">
          <h3 className="">Icon:</h3>
          <div className="z-50 mb-1 scale-75"></div>
        </li>
      </ul>
    </div>
  );
};
