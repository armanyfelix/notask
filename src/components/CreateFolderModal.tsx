import supabase from "../utils/supabase";
import { useContext, useState } from "react";
import { AlertContext } from "../context/AlertContext";
import {
  Button,
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";

interface Props {
  parent: any;
  open: boolean;
  setOpen: (value: boolean) => void;
  account: any;
  getData: () => void;
}

export default function CreateFolderModal({
  open,
  setOpen,
  parent,
  account,
  getData,
}: Props) {
  const [invalid, setInvalid] = useState<boolean>(false);
  const notify = useContext(AlertContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setInvalid(false);
    let values = Object.fromEntries(new FormData(e.currentTarget));
    values.account = account.id;
    if (parent) {
      switch (parent.type) {
        case "space":
          values.space = parent.id;
          break;
        case "folder":
          values.folder = parent.id;
          break;
        default:
          break;
      }
    }
    const { error, data } = await supabase
      .from("folders")
      .insert([values])
      .select()
      .single();
    if (error) {
      notify("error", "Error creating the folder, try again later.");
    }
    if (data) {
      notify("success", "Folder created.");
      getData();
      setOpen(false);
    }
  };

  return (
    <Modal isDismissable isOpen={open} onOpenChange={() => setOpen(false)}>
      <Dialog className="card w-96 dialog">
        <Form
          onSubmit={onSubmit}
          onInvalid={(e) => {
            e.preventDefault();
            setInvalid(true);
          }}
          className="card-body"
        >
          <Heading slot="title" className="card-title">
            New folder
          </Heading>
          <TextField
            name="name"
            type="text"
            autoFocus
            isRequired
            minLength={3}
            maxLength={30}
          >
            <Label
              className={`input flex bg-transparent input-bordered items-center gap-3 ${invalid ? "input-error" : "input-bordered"}`}
            >
              <span className="icon-[solar--folder-2-linear]"></span>
              <Input
                className="grow placeholder:text-base-content/50"
                placeholder="Name"
              />
            </Label>
            <FieldError className="text-sm font-bold text-error" />
          </TextField>
          <div className="card-actions justify-end">
            <Button type="submit" className="btn btn-primary">
              Create
            </Button>
          </div>
        </Form>
      </Dialog>
    </Modal>
  );
}
