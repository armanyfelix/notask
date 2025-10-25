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
      name: "home",
      path: "/",
      icon: <span className="icon-[tabler--home] size-6"></span>,
    },
    {
      name: "lists",
      path: "/",
      icon: <span className="icon-[tabler--list-check] size-6"></span>,
    },
    {
      name: "notes",
      path: "/",
      icon: <span className="icon-[tabler--notebook] size-6"></span>,
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
    <aside className="flex">
      <div className="static select-none h- lef z-50 w-10 flex flex-col items-center bg-base-100">
        {routes.map((r, i) => (
          <Link
            key={i}
            to={r.path}
            onClick={() => onToggle(r.name, r.name)}
            className={`btn btn-ghost btn-square btn-sm ${closeSidebar && !space ? "" : ""}`}
          >
            {r.icon}
            {/*{closeSidebar && !space ? <span>{r.name}</span> : ""}*/}
          </Link>
        ))}
        <Button
          onPress={() => setOpenFavoritesSidebar(!openFavoritesSidebar)}
          className={`group btn btn-ghost btn-xs justify-between text-xs font-medium tracking-tighter opacity-50 p-0.5 ${closeSidebar && !space ? "btn-wd" : "p5"}`}
        >
          <span className="icon-[solar--star-fall-bold] size-4.5"></span>
          {/*{closeSidebar && !space && "Favorites"}*/}
          <span
            className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${closeSidebar && !space ? "size-" : "size-3"} ${openFavoritesSidebar && "rotate-180"}`}
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
          className={`group btn btn-ghost btn-xs  p-0.5 ${closeSidebar && !space ? "btnde" : ""}`}
        >
          <span className="icon-[solar--planet-4-bold] size-4.5"></span>
          {/*{closeSidebar && !space && "Spaces"}*/}
          <span
            className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${closeSidebar && !space ? "size-" : "size-3"} ${openSpacesSidebar && "rotate-180"}`}
          ></span>
        </Button>
        {openSpacesSidebar &&
          spaces &&
          spaces.map((s: any) => (
            <Button
              key={s.id}
              className={`btn btn-ghost btn-square btn-sm ${closeSidebar && !space ? "bt" : "btn-circustify-center"}`}
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
              {/*{closeSidebar && !space ? <span>{s.name}</span> : ""}*/}
            </Button>
          ))}
        <div className="mt-auto">Foo</div>
      </div>

      <div
        style={{
          marginRight: `${closeSidebar ? 0 : -width - 6}px`,
          transition: "0.5s ease",
        }}
        className="select-none absolute shadow-md md:static md:shadow-none bg-base-200 hidden sm:flex"
      >
        <div
          className={twMerge(
            "flex transition-all duration-500",
            closeSidebar ? "min-w-[120px]  max-w-[510px]" : "-translate-x-full",
          )}
        >
          <div
            style={{ width: `${width}px` }}
            className={twMerge(
              "relative min-w-[120px] max-w-[510px] max-h-dvh flex flex-col  justify-between gap-5 text-sm p-3 pb-1",
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
