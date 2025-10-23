import {
  Button,
  FieldError,
  Form,
  Input,
  TextArea,
  TextField,
} from "react-aria-components";
import supabase from "@/utils/supabase";
import { Suspense, useContext, useState } from "react";
import { AlertContext } from "@/context/AlertContext";
import IconSelectorPopover from "./IconSelectorPopover";

interface Props {
  accountId: number | undefined;
  spaces: any;
  setSpaces: (value: any) => void;
  onClose: () => void;
}

export default function CreateSpace({
  accountId,
  spaces,
  setSpaces,
  onClose,
}: Props) {
  const [icon, setIcon] = useState<any>({
    image: "",
    name: "",
    color: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const notify = useContext(AlertContext);

  const onCreateSpace = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let values: any = Object.fromEntries(new FormData(e.currentTarget));

    console.log("icon :>> ", icon);
    if (icon.image) {
      const fileExt = icon.image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error } = await supabase.storage
        .from("spaces_icons")
        .upload(filePath, icon.image);
      if (error) {
        notify(
          "error",
          "The avatar could not be saved, please try again later.",
        );
      } else {
        values = {
          ...values,
          image: data.path,
        };
      }
    }
    if (icon.name) {
      values = {
        ...values,
        icon: {
          name: icon.name,
          color: icon.color,
        },
      };
    }
    const { data, error } = await supabase
      .from("spaces")
      .insert([
        {
          ...values,
          name: values.name.trim(),
          description: values.description,
          account: accountId,
        },
      ])
      .select()
      .single();
    if (error) {
      notify("error", "Error creating the space, try again later");
    } else {
      notify("success", "Space created");
      setSpaces([...spaces, data]);
    }
    setLoading(false);
    onClose();
    setIcon({
      image: "",
      name: "",
      color: "",
    });
  };

  return (
    <Form onSubmit={onCreateSpace} className="space-y-3">
      <div className="join w-full">
        <Suspense fallback="">
          <IconSelectorPopover selectedIcon={icon} setSelectedIcon={setIcon} />
        </Suspense>
        <TextField
          name="name"
          type="text"
          autoFocus
          isRequired
          minLength={3}
          maxLength={30}
          className="w-full"
        >
          <Input
            className="input join-item input-bordered w-full border-l-0 bg-transparent font-semibold outline-none placeholder:text-base-content/50 invalid:border-error"
            placeholder="Name"
          />
          <FieldError className="text-error" />
        </TextField>
      </div>
      <TextField
        name="description"
        type="text"
        minLength={3}
        maxLength={1000}
        className="w-full"
      >
        <TextArea
          className="textarea textarea-bordered w-full bg-transparent placeholder:text-base-content/50"
          rows={2}
          placeholder="Description (optional)"
        ></TextArea>
      </TextField>
      <div className="card-actions justify-end">
        <Button
          type="submit"
          className="btn btn-primary text-xl"
          // disabled={!name.value}
          // onClick={() => onCreateSpace()}
        >
          {loading ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            "Create Space"
          )}
        </Button>
      </div>
    </Form>
  );
}
