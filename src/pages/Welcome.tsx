// import UserIcon from '../assets/svgs/user.svg?react'
// import TrashIcon from '../assets/svgs/trash.svg?react'
import { FormEvent, useState } from "react";
import supabase from "../utils/supabase";
import defaultListPresets from "../data/default-list-presets.json";
import {
  AccountState,
  SessionState,
  useAccountStore,
  useSessionStore,
} from "../utils/zustand";
import { redirect } from "react-router-dom";
import { Button, Input } from "react-aria-components";

export default function Welcome({}: any) {
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<any>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [appUse, setAppUse] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<any>();
  const [errorAlert, setErrorAlert] = useState<string>("");

  const setAccount = useAccountStore((s: AccountState) => s.setAccount);
  const session = useSessionStore((s: SessionState) => s.session);

  const imageUpload = (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      // Check file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (files[0].size > maxSize) {
        setError("File is too large, please select a file smaller than 5MB.");
        return;
      } else {
        // Check file type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(files[0].type)) {
          setError(
            "Invalid file type, please select a PNG, JPEG, or JPG image.",
          );
          return;
        }
        setError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setAvatar(files[0]);
      }
    }
  };

  const createAccount = async () => {
    const data: any = {
      name,
      user_id: session?.user?.id || null,
      email: session?.user?.email || null,
      app_use: appUse,
      list_presets: defaultListPresets,
    };
    if (avatar.value) {
      const fileExt = avatar.value.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const avatarRes = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar.value);

      if (avatarRes.error) {
        setErrorAlert("The avatar could not be saved, please try again later.");
        setTimeout(() => setErrorAlert(""), 6000);
      } else {
        data.avatar_url = avatarRes.data.path;
      }
    }
    const accountRes = await supabase.from("accounts").insert([data]).select();
    if (accountRes.error) {
      setErrorAlert(
        "The account could not be created, please try again later.",
      );
      setTimeout(() => setErrorAlert(""), 6000);
      redirect("/");
    } else {
      setAccount(accountRes.data[0]);
      redirect("/");
    }
  };

  return (
    <main className="flex h-screen w-screen justify-end bg-[url('/images/newsoldier.jpg')] bg-cover font-futura">
      {errorAlert ? (
        <div className="alert alert-error absolute left-0 right-0 top-3 z-30 mx-auto w-2/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {errorAlert}</span>
        </div>
      ) : (
        ""
      )}
      <div className="flex h-full w-full flex-col justify-between bg-base-100/90 p-5 backdrop-blur-2xl md:w-2/3 md:p-12 lg:w-1/2">
        <div className="carousel w-full pt-10">
          {/* (1) ADD NAME */}
          <section id="1" className="carousel-item w-full">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="mb-3 text-5xl font-bold">Welcome to Notask</h1>
              <h2 className="mt-1 text-xl font-semibold opacity-60">
                Start to navigate your mind
              </h2>
              <Input
                type="text"
                placeholder="Your name"
                className="mt-32 w-full border-b border-base-300 bg-transparent p-3 text-xl shadow outline-none duration-100 ease-out focus:border-b-2 focus:border-primary"
                onInput={(e: any) =>
                  setName((e.target as HTMLInputElement).value)
                }
              />
              <div className="flex w-full justify-end gap-2 py-2">
                <a
                  href={`#${step}`}
                  onClick={() => setStep(step + 1)}
                  // disabled={!name.value}
                  className="btn btn-primary mt-10"
                >
                  Next
                </a>
              </div>
            </div>
          </section>
          {/* (2) ADD AVATAR */}
          <section id="2" className="carousel-item w-full">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="mb-7 text-4xl font-bold">Add a avatar</h1>
              {/* <h2 className="mt-1 text-xl font-semibold">
                The command center for your life
              </h2> */}
              <div className="card items-center bg-base-100 p-5 shadow-lg">
                <div>
                  {typeof avatarUrl === "string" ? (
                    <figure>
                      <img
                        src={avatarUrl || ""}
                        className="h-40 w-40 rounded-full object-cover object-center"
                        alt="Movie"
                      />
                    </figure>
                  ) : (
                    // <UserIcon className='h-48 w-48' />
                    "user icon"
                  )}
                </div>
                <div className="card-body shrink-0">
                  {error ? <span className="text-error">{error}</span> : ""}
                  <div className="flex flex-wrap items-end justify-end">
                    <Input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="file-input file-input-bordered file-input-md"
                      value={avatar}
                      onInput={imageUpload}
                    />
                    {avatar ? (
                      <button
                        onClick={() => {
                          setAvatar(null);
                          setAvatarUrl(null);
                        }}
                        className="btn btn-error mt-4"
                      >
                        {/* <TrashIcon className='h-7 w-7' /> */}
                        trash
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full items-baseline justify-end gap-2 py-2">
                <a
                  href={`#${step}`}
                  onClick={() => {
                    setStep(step + 1);
                    setAvatar(null);
                    setAvatarUrl(null);
                  }}
                  className="link-hover link"
                >
                  Skip
                </a>
                <a
                  href={`#${step}`}
                  // disabled={error.value ? true : false}
                  onClick={() => setStep(step + 1)}
                  className="btn btn-primary mt-10"
                >
                  Next
                </a>
              </div>
            </div>
          </section>
          <section id="3" className="carousel-item w-full">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="text-2xl font-bold text-primary-content">
                What kind of use do you want to give it?
              </h1>
              <div className="mt-10 flex justify-evenly gap-5">
                <Button
                  className={`btn btn-lg flex h-full w-52 flex-col p-5 text-center ${
                    appUse === "individual" && "ring-2 ring-primary"
                  }`}
                  onPress={() => setAppUse("individual")}
                >
                  <img src="/images/individual.png" className="" />
                  Individual
                </Button>
                <Button
                  className={`btn btn-lg flex h-full w-52 flex-col p-5 text-center ${
                    appUse === "collaborative" && "ring-2 ring-primary"
                  }`}
                  onPress={() => setAppUse("collaborative")}
                >
                  <img src="/images/group.png" />
                  Collaborative
                </Button>
              </div>
              <div className="flex w-full justify-end gap-2 py-2">
                <a
                  href={`#${step}`}
                  onClick={() => setStep(step + 1)}
                  // disabled={!appUse.value}
                  className="btn btn-primary mt-10 capitalize"
                >
                  Next
                </a>
              </div>
            </div>
          </section>
          <section id="4" className="carousel-item w-full">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="text-4xl text-primary-content">
                Choose how to save your information
              </h1>
              <div className="flex w-full justify-end gap-2 py-2">
                <a
                  href={`#${step}`}
                  onClick={() => setStep(step + 1)}
                  className="btn btn-primary mt-10 capitalize"
                >
                  Next
                </a>
              </div>
            </div>
          </section>
          <section id="5" className="carousel-item w-full">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="text-5xl font-bold">All ready!</h1>
              <h2 className="">Time to create</h2>
              <div className="flex w-full justify-end gap-2 py-2">
                <Button
                  onPress={createAccount}
                  isDisabled={!name && !appUse}
                  className="btn btn-primary mt-10 capitalize"
                >
                  Finish
                </Button>
              </div>
            </div>
          </section>
        </div>
        <ul className="steps steps-horizontal">
          <li
            data-content=""
            className={`step ${step >= 1 && "step-primary z-10"} translate-y-9`}
          >
            <a
              href="#1"
              className="z-20 h-8 w-8 -translate-y-9 rounded-full"
              onClick={() => setStep(1)}
            ></a>
          </li>
          <li
            data-content=""
            className={`step ${step >= 2 && "step-primary z-10"} translate-y-9`}
          >
            <a
              href="#2"
              className="z-20 h-8 w-8 -translate-y-9 rounded-full"
              onClick={() => setStep(2)}
            ></a>
          </li>
          <li
            data-content=""
            className={`step ${step >= 3 && "step-primary z-10"} translate-y-9`}
          >
            <a
              href="#3"
              className="z-20 h-8 w-8 -translate-y-9 rounded-full"
              onClick={() => setStep(3)}
            ></a>
          </li>
          <li
            data-content=""
            className={`step ${step >= 4 && "step-primary z-10"} translate-y-9`}
          >
            <a
              href="#4"
              className="z-20 h-8 w-8 -translate-y-9 rounded-full"
              onClick={() => setStep(4)}
            ></a>
          </li>
          <li
            data-content=""
            className={`step ${step >= 5 && "step-primary z-10"} translate-y-9`}
          >
            <a
              href="#5"
              className="z-20 h-8 w-8 -translate-y-9 rounded-full"
              onClick={() => setStep(5)}
            ></a>
          </li>
        </ul>
      </div>
    </main>
  );
}
