import { useEffect, useRef, useState } from "react";
import {
  useAccountStore,
  useSidebarStore,
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

  const refBox = useRef(null);
  const refRight = useRef(null);
  const routes = [
    {
      name: "home",
      icon: <span className="icon-[solar--home-bold-duotone] h-7 w-7"></span>,
    },
    {
      name: "lists",
      icon: (
        <span className="icon-[solar--checklist-minimalistic-bold-duotone] h-7 w-7"></span>
      ),
    },
    {
      name: "notes",
      icon: <span className="icon-[solar--book-2-bold-duotone] h-7 w-7"></span>,
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
        const newWidth = Math.min(Math.max(e.clientX, 220), 410);
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
    <aside
      style={{
        marginRight: `${closeSidebar ? 0 : -width + 0}px`,
        transition: "0.5s ease",
      }}
      className="select-none absolute shadow-md md:static md:shadow-none hidden border-r border-neutral bg-base-100 sm:flex"
    >
      <div
        className={twMerge(
          "flex transition-all duration-500",
          closeSidebar ? "min-w-[220px]  max-w-[410px]" : "-translate-x-full",
        )}
      >
        <div
          style={{ width: `${width}px` }}
          className={twMerge(
            "relative min-w-[220px] max-w-[410px] max-h-dvh flex flex-col justify-between gap-5 text-sm border-r border-neutral bg-base-100 p-3 pb-1",
          )}
        >
          <section className="py-1 pl-1">
            <ul>
              {routes.map((r, i) => (
                <li key={i}>
                  <Button
                    onPress={() => onToggle(r.name, r.name)}
                    className={`btn btn-ghost flex-nowrap font-sans text-lg transition-all duration-500 w-full ${closeSidebar && !space ? "btn- justify-start" : "btn-circle"}`}
                  >
                    {r.icon}
                    {closeSidebar && !space ? <span>{r.name}</span> : ""}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
          <span className="divider"></span>
          <section className=" py-1 pl-1">
            <div>
              <Button
                onPress={() => setOpenFavoritesSidebar(!openFavoritesSidebar)}
                className={`group btn btn-ghost btn-xs justify-between text-xs font-medium tracking-tighter opacity-50 ${closeSidebar && !space ? "btn-wide" : "px-1"}`}
              >
                <span className="icon-[solar--star-fall-bold] h-4 w-4"></span>
                {closeSidebar && !space && "Favorites"}
                <span
                  className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${closeSidebar && !space ? "h-5 w-5" : "h-3 w-3"} ${openFavoritesSidebar && "rotate-180"}`}
                ></span>
              </Button>
              <div>
                {openFavoritesSidebar && (
                  <ul className="menu menu-xs space-y-3">
                    <li className="items-center">
                      <Link
                        to="/"
                        className="hover:bg-opacity-9 tooltip tooltip-right rounded-btn p-2 leading-0"
                        data-tip="planet"
                      >
                        <span className="icon-[solar--star-linear] size-5"></span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div>
              <Button
                onPress={() => setOpenSpacesSidebar(!openSpacesSidebar)}
                className={`group btn btn-ghost btn-xs justify-between text-xs font-medium tracking-tighter opacity-50 ${closeSidebar && !space ? "btn-wide" : "px-1"}`}
              >
                <span className="icon-[solar--planet-4-bold] h-4 w-4"></span>
                {closeSidebar && !space && "Spaces"}
                <span
                  className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${closeSidebar && !space ? "size-5" : "size-3"} ${openSpacesSidebar && "rotate-180"}`}
                ></span>
              </Button>
              <div>
                {openSpacesSidebar && (
                  <ul className="mt-2 space-y-2">
                    {spaces &&
                      spaces.map((s: any) => (
                        <li key={s.id}>
                          <Button
                            className={`btn flex items-center p-2.5 ${
                              s?.icon?.color && `hover:bg-opacity-60`
                            } ${closeSidebar && !space ? "btn-wide justify-start" : "btn-circle justify-center"}`}
                            onPress={() => {
                              onOpenSpace(s);
                            }}
                          >
                            {!s.image && !s.icon && (
                              <span className="icon-[solar--planet-bold-duotone] size-6"></span>
                            )}
                            {s.image && (
                              <img
                                src={s.image}
                                width={24}
                                height={24}
                                alt=""
                              />
                            )}
                            {!s.image && s.icon && (
                              <Icon
                                icon={`tabler:${s.icon.name}`}
                                style={{ color: s.icon.color }}
                                width={24}
                                height={24}
                              />
                            )}
                            {closeSidebar && !space ? (
                              <span>{s.name}</span>
                            ) : (
                              ""
                            )}
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
          <span className="divider"></span>
          <section
            className={`${
              closeSidebar && space
                ? "w-56 translate-x-0 scale-100 border-l-2 border-base-300"
                : "w-0 -translate-x-96! scale-50"
            } box-border overflow-auto bg-base-200 py-2`}
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
          <div className="mt-auto">Footer</div>
        </div>
        <div
          onMouseDown={() => setTrack(true)}
          className="w-1.5 h-screen bg-transparent hover:bg-neutral-600/80 transition-colors cursor-col-resize"
        ></div>
      </div>
    </aside>
  );
}
