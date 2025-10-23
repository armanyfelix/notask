import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Heading,
  Input,
  Modal,
  Popover,
  TextArea,
  TextField,
} from "react-aria-components";
import PlusIcon from "@/assets/svgs/plus.svg?react";
import supabase from "@/utils/supabase";
import { useState } from "react";

export default function CreateItemModal({ list, space, getItems }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (e: any, close: any) => {
    e.preventDefault();
    setLoading(true);
    let values = Object.fromEntries(new FormData(e.currentTarget));
    console.log("values :>> ", values);

    const { data, error } = await supabase
      .from("items")
      .insert([
        {
          ...values,
          list: list.value.id,
          space: space.value.id,
        },
      ])
      .select()
      .single();
    if (data) {
      console.log("data :>> ", data);
      close();
      getItems();
    }
    if (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <DialogTrigger>
      <Button className="btn btn-square btn-sm">
        <PlusIcon />
      </Button>
      <Modal isDismissable className="mx-3 w-full md:mx-36 lg:w-3/5 xl:w-2/5">
        <Dialog className="card card-compact bg-neutral/70 border-2 border-neutral text-neutral-content backdrop-blur">
          {({ close }) => (
            <form className="card-body" onSubmit={(e) => onSubmit(e, close)}>
              <Heading slot="title" className="card-title">
                Item
              </Heading>
              <div>
                <LocationSelect />
              </div>
              <TextField
                name="name"
                type="text"
                autoFocus
                isRequired
                minLength={1}
                maxLength={50}
              >
                {/* <Label className="label-text label">First Name:</Label> */}
                <Input
                  className="input input-ghost mb-1 w-full invalid:input-error"
                  placeholder="Item Name"
                />
                <FieldError className="ml-2 text-sm font-bold text-error" />
              </TextField>
              <TextField name="description" minLength={3} maxLength={200}>
                {/* <Label>Last Name:</Label> */}
                <TextArea
                  rows={3}
                  className="textarea textarea-ghost w-full"
                  placeholder="Add Description"
                />
              </TextField>
              <ul className="flex items-center space-x-2">
                <li>
                  <Button className="btn btn-sm">To do</Button>
                </li>
                <li>
                  <Button className="btn btn-outline btn-sm">Priority</Button>
                </li>
                <li>
                  <Button className="btn btn-outline btn-sm">Settings</Button>
                </li>
              </ul>
              <div className="card-actions mt-5 justify-end">
                <Button onPress={close} className="btn- btn btn-outline">
                  Cancel
                </Button>
                <Button type="submit" className="btn btn-secondary">
                  {loading ? (
                    <span className="loading loading-dots"></span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

function LocationSelect() {
  return (
    <DialogTrigger>
      <Button className="btn btn-ghost btn-xs">
        Settings
        <span className="icon-[solar--alt-arrow-down-outline] open:rotate-180"></span>
      </Button>
      <Popover>
        <Dialog className="rounded-box bg-neutral/70 p-3 backdrop-blur">
          <div className="flex-col">
            <div className="indicator" /> Wi-Fi
            <div className="indicator" /> Bluetooth
            <div className="indicator" /> Mute
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
