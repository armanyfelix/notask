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
import ListConfig from "./listConfig";
import type { TablesInsert } from "../types/database.types";

interface Props {
  parent: any;
  open: boolean;
  setOpen: (value: boolean) => void;
  account: any;
  setAccount: any;
  getData: () => void;
}

// const invalid = signal<boolean>(false)

// const view = signal<string>('list')

export default function CreateListModal({
  open,
  setOpen,
  parent,
  account,
  setAccount,
  getData,
}: Props) {
  const [configOpen, setConfigOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<any>(null);
  const notify = useContext(AlertContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    // invalid.value = false
    const formData = new FormData(e.currentTarget);
    const values: TablesInsert<"lists"> = {
      name: String(formData.get("name") ?? ""),
      account: account.id,
    };
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
      .from("lists")
      .insert([values])
      .select()
      .single();
    if (error) {
      notify("error", "Error creating the list, try again later.");
    }
    if (data) {
      notify("success", "List created.");
      getData();
      setOpen(false);
    }
  };

  return (
    <Modal isDismissable isOpen={open} onOpenChange={() => setOpen(false)}>
      <Dialog
        className={`dialog card min-w-96 ${configOpen && "card-compact"}`}
      >
        <div className="card-body">
          <div className="flex items-center">
            {configOpen && (
              <Button
                onPress={() => setConfigOpen(false)}
                className="btn btn-square btn-ghost mr-4"
              >
                <span className="icon-[solar--arrow-left-outline] h-7 w-7"></span>
              </Button>
            )}
            <Heading slot="title" className="card-title mt-1 text-2xl">
              New list
            </Heading>
          </div>
          {configOpen ? (
            <>
              <ListConfig
                account={account}
                setAccount={setAccount}
                config={config}
                setConfig={setConfig}
              />
            </>
          ) : (
            <Form
              onSubmit={onSubmit}
              // onInvalid={(e) => {
              //   e.preventDefault()
              //   invalid.value = true
              // }}
              className="form-control space-y-3"
            >
              <TextField
                name="name"
                type="text"
                autoFocus
                isRequired
                minLength={3}
                maxLength={30}
              >
                <Label
                  className={`input input-bordered flex items-center gap-3 has-[:invalid]:input-error`}
                >
                  <span className="icon-[solar--clipboard-list-outline]"></span>
                  <Input className="grow" placeholder="Name" />
                </Label>
                <FieldError className="text-sm font-bold text-error" />
              </TextField>
              <Button
                onPress={() => setConfigOpen(true)}
                className="btn btn-outline justify-between text-lg font-medium"
              >
                <div>Settings</div>
                <div>{config?.name || "custom"}</div>
              </Button>
              <div className="card-actions justify-end">
                <Button type="submit" className="btn btn-primary">
                  Create
                </Button>
              </div>
            </Form>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}
