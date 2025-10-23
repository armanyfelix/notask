import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Input,
  Popover,
  TextArea,
  TextField,
} from "react-aria-components";

export default function CreateItem() {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <form onSubmit={(e) => console.log(e)} className="space-y-3">
      {/* <h1 className="card-title">Item</h1> */}
      <div className="">
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
          className="input input-bordered w-full bg-transparent text-base-content invalid:input-error placeholder:text-base-content/50"
          placeholder="Item Name"
        />
        <FieldError className="ml-2 text-sm font-bold text-error" />
      </TextField>
      <TextField name="description" minLength={3} maxLength={200}>
        {/* <Label>Last Name:</Label> */}
        <TextArea
          rows={2}
          className="textarea textarea-bordered w-full bg-transparent placeholder:text-base-content/50"
          placeholder="Add Description"
        />
      </TextField>
      <ul className="mt-1 flex items-center space-x-2">
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
        <Button onPress={close} className="btn btn-outline">
          Cancel
        </Button>
        <Button type="submit" className="btn btn-primary">
          {loading ? <span className="loading loading-dots"></span> : "Save"}
        </Button>
      </div>
    </form>
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
        <Dialog className="dialog p-3">
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
