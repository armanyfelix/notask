import { useEffect, useState } from "react";
import {
  useAccountStore,
  useSidebarStore,
  useSpacesStore,
  useUIStore,
} from "../utils/zustand";
import supabase from "../utils/supabase";
import { addImageUrl } from "../helpers/images";
import { Button } from "react-aria-components";
import { Link } from "react-router";
import ListsExplorer from "./ListsExplorer";
import SpaceExplorer from "./SpaceExplorer";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { twMerge } from "tailwind-merge";

export default function Sidebar() {
  const [space, setSpace] = useState<any>(null);
  const [page, setPage] = useState<string>("");
  // const favorites = signal<any>([])

  const { account, setAccount } = useAccountStore();
  // const session = useSessionStore()
  const { spaces } = useSpacesStore();
  const { closeSidebar, setCloseSidebar } = useSidebarStore();
  const {
    setOpenFavoritesSidebar,
    openFavoritesSidebar,
    setOpenSpacesSidebar,
    openSpacesSidebar,
  } = useUIStore();

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <span className="icon-[tabler--home] size-6"></span>,
    },
    {
      name: "Lists",
      path: "/",
      icon: <span className="icon-[tabler--list-check] size-6"></span>,
    },
    {
      name: "Notes",
      path: "/",
      icon: <span className="icon-[tabler--notebook] size-6"></span>,
    },
    {
      name: "Whiteboard",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              d="M14 4h-4C6.229 4 4.343 4 3.172 5.172S2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c2.809 0 4.213 0 5.222-.674a4 4 0 0 0 1.104-1.104C21 17.213 21 15.81 21 13"
            />
            <path
              stroke-linecap="round"
              d="M2 12.017L4.5 9.6a2.173 2.173 0 0 1 3 0c.828.8.828 2.098 0 2.899a2 2 0 0 0 0 2.9c.828.8 2.172.8 3 0l.5-.484"
            />
            <path d="M14.672 13H13v-1.672a2 2 0 0 1 .586-1.414l5.476-5.475a1.5 1.5 0 0 1 2.121 0l.379.379a1.5 1.5 0 0 1 0 2.121l-5.476 5.475a2 2 0 0 1-1.414.586Z" />
          </g>
        </svg>
      ),
    },
  ];

  const onOpenSpace = (s: any) => {
    setCloseSidebar(page === s.name ? !closeSidebar : true);
    setSpace(s);
    setPage(s.name);
  };

  const onToggle = (p: string, a: string) => {
    setCloseSidebar(page === a ? !closeSidebar : true);
    setSpace(null);
    setPage(p);
  };

  async function getFavorites() {
    if (account) {
      const { data } = await supabase
        .from("lists")
        .select("*")
        .eq("favorite", true);
      if (data) {
        const withImages = await addImageUrl(data);
        return withImages;
      }
    }
  }
  const [track, setTrack] = useState(false);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (track) {
        const newWidth = Math.min(Math.max(e.clientX, 120), 510);
        setWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (track) setTrack(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [track]);

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <aside className="flex items-start">
      <div className="static select-none z-50 w-10 flex flex-col space-y-2 items-center justify-between h-[calc(100vh-40px)] bg-base-100">
        {routes.map((r, i) => (
          <Link
            key={i}
            to={r.path}
            onClick={() => onToggle(r.name, r.name)}
            className={`btn btn-ghost btn-square btn-sm tooltip tooltip-right`}
            data-tip={r.name}
          >
            {r.icon}
            {/*{closeSidebar && !space ? <span>{r.name}</span> : ""}*/}
          </Link>
        ))}
        <Button
          onPress={() => setOpenFavoritesSidebar(!openFavoritesSidebar)}
          className={`group btn btn-ghost btn-xs p-0.5 tooltip tooltip-right`}
          data-tip="Favorites"
        >
          <span className="icon-[solar--star-fall-bold] -mr-1 size-4.5"></span>
          <span
            className={`icon-[solar--alt-arrow-up-linear] duration-300 ease-in-out ${openFavoritesSidebar && "rotate-180"}`}
          ></span>
        </Button>
        {openFavoritesSidebar && (
          <Button
            className="btn btn-ghost btn-square btn-sm tooltip tooltip-right"
            data-tip="planet"
          >
            <span className="icon-[tabler--star] size-5"></span>
          </Button>
        )}
        <Button
          onPress={() => setOpenSpacesSidebar(!openSpacesSidebar)}
          className={`group btn btn-ghost btn-xs p-0.5 tooltip tooltip-right`}
          data-tip="Spaces"
        >
          <span className="icon-[solar--planet-4-bold] -mr-1 size-4.5"></span>
          <span
            className={`icon-[solar--alt-arrow-up-linear] duration-300 ease-in-out size-3 ${openSpacesSidebar && "rotate-180"}`}
          ></span>
        </Button>
        {openSpacesSidebar &&
          spaces &&
          spaces.map((s: any) => (
            <Button
              key={s.id}
              className={`btn btn-ghost btn-square btn-sm tooltip tooltip-right`}
              data-tip={`${s.name}`}
              onPress={() => {
                onOpenSpace(s);
              }}
            >
              {!s.image && !s.icon && (
                <span className="icon-[solar--planet-bold-duotone] size-6"></span>
              )}
              {s.image && <img src={s.image} width={24} height={24} alt="" />}
              {!s.image && s.icon && (
                <Icon
                  icon={`tabler:${s.icon.name}`}
                  style={{ color: s.icon.color }}
                  width={24}
                  height={24}
                />
              )}
            </Button>
          ))}
        <div className="mt-auto">Foo</div>
      </div>

      <div
        style={{
          marginRight: `${closeSidebar ? 0 : -width - 6}px`,
          transition: "0.5s ease",
        }}
        className="select-none absolute shadow-md md:static md:shadow-none hidden sm:flex"
      >
        <div
          className={twMerge(
            "flex transition-all duration-500 bg-base-200",
            closeSidebar ? "min-w-[120px]  max-w-[510px]" : "-translate-x-full",
          )}
        >
          <div
            style={{ width: `${width}px` }}
            className={twMerge(
              "relative min-w-[120px] max-w-[510px] max-h-dvh flex flex-col justify-between gap-5 text-sm p-3 pb-1",
            )}
          >
            <section
            // className={`${
            //   closeSidebar && space
            //     ? "w-56 translate-x-0 scale-100 border-l-2 border-base-300"
            //     : "w-0 -translate-x-96! scale-50"
            // } box-border overflow-auto bg-base-200 py-2`}
            >
              {page === "lists" && <ListsExplorer />}
              {closeSidebar && space && (
                <SpaceExplorer
                  space={space}
                  account={account}
                  setAccount={setAccount}
                />
              )}
            </section>
            <div className="mt-auto ">Footer</div>
          </div>
          <div
            onMouseDown={() => setTrack(true)}
            className="w-1.5 h-screen bg-transparent hover:bg-neutral-600/80 transition-colors cursor-col-resize"
          ></div>
        </div>
      </div>
    </aside>
  );
}
