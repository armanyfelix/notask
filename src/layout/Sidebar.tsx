import { useEffect, useState } from "react";
import {
  useAccountStore,
  useSidebarsStore,
  useSpacesStore,
  useUIStore,
} from "../utils/zustand";
import supabase from "../utils/supabase";
import { addImageUrl } from "../helpers/images";
import { Button } from "react-aria-components";
import { Link } from "react-router-dom";
import ListsExplorer from "./ListsExplorer";
import SpaceExplorer from "./SpaceExplorer";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { twMerge } from "tailwind-merge";

export default function Sidebar() {
  const { account, setAccount } = useAccountStore();
  const { spaces } = useSpacesStore();
  const { leftSidebarOpen, setLeftSidebarOpen } = useSidebarsStore();
  const {
    setOpenFavoritesSidebar,
    openFavoritesSidebar,
    setOpenSpacesSidebar,
    openSpacesSidebar,
  } = useUIStore();

  const [space, setSpace] = useState<any>(null);
  const [page, setPage] = useState<string>("");
  const [track, setTrack] = useState(false);
  const [width, setWidth] = useState(320);

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: (
        <span className="icon-[solar--home-smile-angle-bold-duotone] size-6"></span>
      ),
    },
    {
      name: "Lists",
      path: "/list",
      icon: (
        <span className="icon-[solar--checklist-minimalistic-bold-duotone] size-6"></span>
      ),
    },
    {
      name: "Notes",
      path: "/",
      icon: (
        <span className="icon-[solar--notebook-bold-duotone] size-6"></span>
      ),
    },
    {
      name: "Whiteboard",
      path: "/",
      icon: (
        <span className="icon-[solar--pen-new-square-bold-duotone] size-6"></span>
      ),
    },
  ];

  const onOpenSpace = (s: any) => {
    setLeftSidebarOpen(page === s.name ? !leftSidebarOpen : true);
    setSpace(s);
    setPage(s.name);
  };

  const onToggle = (p: string, a: string) => {
    setLeftSidebarOpen(page === a ? !leftSidebarOpen : true);
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (track) {
        const newWidth = Math.min(Math.max(e.clientX, 120), 420);
        setWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (track) setTrack(false);
    };
    if (track) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
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
      <div
        style={{
          marginRight: `${leftSidebarOpen ? 0 : -width - 12}px`,
          transition: "0.5s ease",
        }}
        className="select-none absolute shadow-md md:static md:shadow-none hidden sm:flex"
      >
        <div
          className={twMerge(
            "flex transition-all duration-500 bg-base-200/65 backdrop-blur-md",
            leftSidebarOpen
              ? "min-w-[120px]  max-w-[420]"
              : "-translate-x-full",
          )}
        >
          <div
            style={{ width: `${width}px` }}
            className={twMerge(
              "relative min-w-[120px] max-w-[420] h-[calc(100vh-40px)] flex ml-1.5 overflow-auto flex-col justify-between",
            )}
          >
            {/*<div className="static select-none z-50 w-10 flex flex-col space-y-2 items-center justify-between h-[calc(100vh-32px)] bg-base-100">
              {routes.map((r, i) => (
                <Link
                  key={i}
                  to={r.path}
                  onClick={() => onToggle(r.name, r.name)}
                  className={`btn btn-ghost btn-square btn-sm tooltip tooltip-right`}
                  data-tip={r.name}
                >
                  {r.icon}
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
                    {s.image && (
                      <img src={s.image} width={24} height={24} alt="" />
                    )}
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
              <div className="mt-auto">
                <Link
                  to="/settings"
                  className="btn btn-ghost btn-square btn-sm"
                >
                  <span className="icon-[solar--settings-bold-duotone] size-6"></span>
                </Link>
              </div>
            </div>*/}
            {page === "lists" && <ListsExplorer />}
            {leftSidebarOpen && space && (
              <SpaceExplorer
                space={space}
                account={account}
                setAccount={setAccount}
              />
            )}
            <div className="mt-auto">Footer</div>
          </div>
          <div
            onMouseDown={() => setTrack(true)}
            className="w-1.5 h-screen bg-transparent active:bg-secondary hover:bg-secondary transition-colors cursor-col-resize"
          ></div>
        </div>
      </div>
    </aside>
  );
}
