import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import { Link } from "react-router";

interface CreateHubModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function CreateHubModal({
  isOpen,
  setOpen,
}: CreateHubModalProps) {
  const [createHub, setCreateHub] = useState<boolean>(false);
  const [openHub, setOpenHub] = useState<boolean>(false);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <Dialog className="dialog p-5 md:p-12">
        <Heading slot="title" className="pb-10">
          <img src="/logo_orange.png" alt="zag" className="w-48 mx-auto" />
        </Heading>
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
              <button className="btn">Open</button>
            </div>
            <div className="divider"></div>

            <div className="flex items-center justify-between gap-x-10">
              <div>
                <div>Open hub from your Zag account</div>
                <div className="text-xs font-semibold opacity-70">
                  Set up as synced hub with existing remote hub
                </div>
              </div>
              <Link to="signin" className="btn">
                Sign in
              </Link>
            </div>
            <div className="text-center mt-10">
              <Button className="btn btn-primary btn-wide">Quick Start</Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Button
                className="btn btn-ghost"
                onPress={() => setCreateHub(false)}
              >
                <span className="icon-[solar--arrow-left-line-duotone]"></span>
                Back
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-x-10">
                <div>
                  <div>Hub name</div>
                  <div className="text-xs font-semibold text-nowrap opacity-70">
                    Pick a name for your new hub
                  </div>
                </div>
                <Input className="input" placeholder="Hub name" />
              </div>
              <div className="divider"></div>
              <div className="flex items-center justify-between gap-x-10">
                <div>
                  <div>Location</div>
                  <div className="text-xs font-semibold opacity-70">
                    Pick a place to put your new hub
                  </div>
                </div>
                <button className="btn">Browse</button>
              </div>
            </div>
            <div className="text-center mt-10">
              <Button className="btn btn-primary btn-wide">Create Hub</Button>
            </div>
          </div>
        )}
      </Dialog>
    </Modal>
  );
}
