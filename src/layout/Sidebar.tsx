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

export default function Sidebar() {
  const [space, setSpace] = useState<any>(null);
  const [page, setPage] = useState<string>("");
  // const favorites = signal<any>([])

  const { account, setAccount } = useAccountStore();
  // const session = useSessionStore()
  const { spaces } = useSpacesStore();
  const { WideSidebar, setWideSidebar } = useSidebarStore();
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
    setWideSidebar(page === s.name ? !WideSidebar : true);
    setSpace(s);
    setPage(s.name);
  };

  const onToggle = (p: string, a: string) => {
    setWideSidebar(page === a ? !WideSidebar : true);
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
    const resizeableElement = refBox.current as unknown as HTMLElement;
    if (resizeableElement) {
      const styles = window.getComputedStyle(resizeableElement);
      let width = parseInt(styles.width, 10);
      let xCord = 0;
      const onMouseMoveRightResize = (e: any) => {
        const dx = e.clientX - xCord;
        xCord = e.clientX;
        width += dx;
        if (width > 200 && width < 700) {
          resizeableElement.style.width = `${width}px`;
        }
      };
      const onMouseUpRightResize = () => {
        document.removeEventListener("mousemove", onMouseMoveRightResize);
      };
      const onMouseDownRightResize = (e: any) => {
        xCord = e.clientX;
        resizeableElement.style.left = styles.left;
        resizeableElement.style.right = "0";
        document.addEventListener("mouseup", onMouseUpRightResize);
        document.addEventListener("mousemove", onMouseMoveRightResize);
      };
      const resizerRight = refRight.current as any;
      resizerRight.addEventListener("mousedown", onMouseDownRightResize);

      return () => {
        resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      };
    }
  }, []);

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <>
      <aside className="hidden h-screen max-h-screen bg-base-200 sm:flex">
        <section className="sticky bottom-0 left-0 top-0 z-50 py-1 pl-1">
          <ul>
            {routes.map((r, i) => (
              <li key={i}>
                <Button
                  onPress={() => onToggle(r.name, r.name)}
                  className={`btn btn-ghost flex-nowrap font-sans text-lg transition-all duration-500 ${WideSidebar && !space ? "btn-wide justify-start" : "btn-circle"}`}
                >
                  {r.icon}
                  {WideSidebar && !space ? <span>{r.name}</span> : ""}
                </Button>
              </li>
            ))}
          </ul>
          <span className="divider"></span>
          <div>
            <Button
              onPress={() => setOpenFavoritesSidebar(!openFavoritesSidebar)}
              className={`group btn btn-ghost btn-xs justify-between text-xs font-medium tracking-tighter opacity-50 ${WideSidebar && !space ? "btn-wide" : "px-1"}`}
            >
              <span className="icon-[solar--star-fall-bold] h-4 w-4"></span>
              {WideSidebar && !space && "Favorites"}
              <span
                className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${WideSidebar && !space ? "h-5 w-5" : "h-3 w-3"} ${openFavoritesSidebar && "rotate-180"}`}
              ></span>
            </Button>
            <div>
              {openFavoritesSidebar && (
                <ul className="menu menu-xs space-y-3">
                  <li className="items-center">
                    <Link
                      to="/"
                      className="hover:bg-opacity-9 tooltip tooltip-right rounded-btn p-2 leading-[0]"
                      data-tip="planet"
                    >
                      <span className="icon-[solar--star-linear] h-5 w-5"></span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div>
            <Button
              onPress={() => setOpenSpacesSidebar(!openSpacesSidebar)}
              className={`group btn btn-ghost btn-xs justify-between text-xs font-medium tracking-tighter opacity-50 ${WideSidebar && !space ? "btn-wide" : "px-1"}`}
            >
              <span className="icon-[solar--planet-4-bold] h-4 w-4"></span>
              {WideSidebar && !space && "Spaces"}
              <span
                className={`icon-[solar--alt-arrow-down-linear] duration-300 ease-in-out ${WideSidebar && !space ? "h-5 w-5" : "h-3 w-3"} ${openSpacesSidebar && "rotate-180"}`}
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
                          } ${WideSidebar && !space ? "btn-wide justify-start" : "btn-circle justify-center"}`}
                          onPress={() => {
                            onOpenSpace(s);
                          }}
                        >
                          {!s.image && !s.icon && (
                            <span className="icon-[solar--planet-bold-duotone] h-6 w-6"></span>
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
                          {WideSidebar && !space ? <span>{s.name}</span> : ""}
                        </Button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          {/* <span className="divider"></span> */}
        </section>

        <section
          ref={refBox}
          className={`${
            WideSidebar && space
              ? "w-56 translate-x-0 scale-100 border-l-2 border-base-300"
              : "w-0 !-translate-x-96 scale-50"
          } box-border overflow-auto bg-base-200 py-2`}
        >
          {page === "lists" && <ListsExplorer />}
          {WideSidebar && space && (
            <SpaceExplorer
              space={space}
              account={account}
              setAccount={setAccount}
            />
          )}
          <div
            ref={refRight}
            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-base-300"
          ></div>
        </section>
      </aside>

      {/* BOTONES DE NAVEGACION ABAJO EN MOVIL */}
      <div className="btm-nav z-50 sm:hidden">
        <button className="text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <button className="active text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button className="text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
