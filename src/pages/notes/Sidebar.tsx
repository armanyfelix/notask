import { useEffect, useState } from "react";
import {
  useAccountStore,
  useSidebarStore,
  useSpacesStore,
  useUIStore,
} from "@/utils/zustand";
import supabase from "@/utils/supabase";
import { Button } from "react-aria-components";
import { Link } from "react-router";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { twMerge } from "tailwind-merge";
import { addImageUrl } from "@/helpers/images";

export default function Sidebar() {
  const [space, setSpace] = useState<any>(null);
  const [page, setPage] = useState<string>("");
  // const favorites = signal<any>([])

  const { account, setAccount } = useAccountStore();
  // const session = useSessionStore()
  const { spaces } = useSpacesStore();
  const [closeSidebar, setCloseSidebar] = useState(false);
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
      <div className="fixed right-0 select-none z-50 w-10 flex flex-col space-y-4 items-center justify-center h-[calc(100vh-66px)]">
        <Button
          // onClick={() => onToggle(r.name, r.name)}
          className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
          data-tip="Comments"
        >
          <span className="icon-[tabler--messages] size-8"></span>
        </Button>
        <Button
          // onClick={() => onToggle(r.name, r.name)}
          className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
          data-tip="Comments"
        >
          <span className="icon-[tabler--markdown] size-8"></span>
        </Button>
        <Button
          // onClick={() => onToggle(r.name, r.name)}
          className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
          data-tip="Comments"
        >
          <span className="icon-[tabler--share-2] size-8"></span>
        </Button>
        <Button
          // onClick={() => onToggle(r.name, r.name)}
          className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
          data-tip="Comments"
        >
          {/*<span className="icon-[tabler--lock-filled] size-8"></span>*/}
          <span className="icon-[tabler--lock-open] size-8"></span>
        </Button>
        <Button
          // onClick={() => onToggle(r.name, r.name)}
          className={`btn btn- btn-square btn-sm tooltip tooltip-right`}
          data-tip="Comments"
        >
          <span className="icon-[tabler--text-resize] size-8"></span>
        </Button>
      </div>

      <div
        style={{
          marginRight: `${closeSidebar ? 0 : -width - 12}px`,
          transition: "0.5s ease",
        }}
        className="select-none absolute shadow-md md:static md:shadow-none hidden sm:flex"
      >
        <div
          onMouseDown={() => setTrack(true)}
          className="w-1.5 h-screen bg-transparent hover:bg-neutral/80 transition-colors cursor-col-resize"
        ></div>
        <div
          className={twMerge(
            "flex transition-all duration-500 bg-base-200",
            closeSidebar ? "min-w-[120px]  max-w-[510px]" : "translate-x-full",
          )}
        >
          <div
            style={{ width: `${width}px` }}
            className={twMerge(
              "relative min-w-[120px] max-w-[510px] h-[calc(100vh-40px)] flex ml-1.5 overflow-auto flex-col justify-between",
            )}
          >
            sidebar
            <div className="mt-auto">Footer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
