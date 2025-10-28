import "./App.css";
import AppLayout from "./layout/AppLayout";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import {
  useAccountStore,
  useSessionStore,
  useSpacesStore,
  useThemeStore,
} from "./utils/zustand";
import Signin from "./pages/auth/Signin";
import Home from "./pages/Home";
import Upcoming from "./pages/lists/Upcoming";
import List from "./pages/lists/List";
import Signup from "./pages/auth/Signup";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import ForgotPassword from "./pages/auth/ForgotPassword";
import supabase from "./utils/supabase";
import ResetPassword from "./pages/auth/ResetPassword";
import { addImageUrl } from "./helpers/images";
import isTauri from "./utils/isTauri";
import { documentDir } from "@tauri-apps/api/path";
import BaseLayout from "./layout/BaseLayout";
import { load } from "@tauri-apps/plugin-store";
import CreateHub from "./pages/CreateHub";

function AppRoutes() {
  const { account, setAccount } = useAccountStore();
  const { session, setSession } = useSessionStore();
  const { theme, setTheme } = useThemeStore();
  const { setSpaces } = useSpacesStore();

  const [allowResetPassword, setAllowResetPassword] = useState<boolean>(false);
  const [noHubs, setNoHubs] = useState<boolean>(false);
  let navigate = useNavigate();

  const getHubs = async () => {
    try {
      const hubsStore = await load("hubs.json");
      const hubsLength = await hubsStore.length();
      if (hubsStore === null || hubsLength <= 0) {
        setNoHubs(true);
        navigate("/getting-started");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAccount = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", id)
        .single();
      if (data) {
        setAccount(data);
        return data;
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getSpaces() {
    if (account) {
      console.log("gettins spaces");
      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("account", account?.id);
      console.log(data);
      if (data?.length) {
        const dataWithImages = await addImageUrl(data);
        setSpaces(dataWithImages);
      }
    }
  }

  const getAppDir = async () => {
    try {
      const dir = await documentDir();
      console.log("Directorio de la app:", dir);
    } catch (error) {
      console.error("Error al obtener directorio:", error);
    }
  };

  const applyTheme = () => {
    if (!theme) {
      if (window.matchMedia("(prefers-color-scheme: dark)")?.matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    } else {
      setTheme(theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newTheme = event.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      });
  };

  const onAuthStateChange = () => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session, account);
      switch (event) {
        case "INITIAL_SESSION":
          if (session) {
            await getAccount(session.user.id);
            getSpaces();
          }
          break;
        case "SIGNED_IN":
          if (session) {
            const acc = await getAccount(session.user.id);
            // setSession(session);
            console.log("getting account", acc);
            getSpaces();
          }
          break;
        case "SIGNED_OUT":
          setSession(null);
          setAccount(null);
          setSpaces([]);
          break;
        case "PASSWORD_RECOVERY":
          setAllowResetPassword(true);
          setSession(null);
          setAccount(null);
          setSpaces([]);
          navigate("/password/reset");
          break;
        case "TOKEN_REFRESHED":
          if (session) {
            setSession(session);
          }
          break;
        case "USER_UPDATED":
          if (session) {
            setSession(session);
            getAccount(session.user.id);
          }
          break;
      }
    });
  };

  useEffect(() => {
    applyTheme();
  }, [theme]);

  useEffect(() => {
    getHubs();
    const { data } = onAuthStateChange();

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            isAllowed={isTauri || (session && account)}
            redirectTo={
              !session && !isTauri
                ? "/signin"
                : (session || isTauri) && !account && "/welcome"
            }
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Home />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/list/:id" element={<List />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute isAllowed={!session && !account} />}>
        <Route element={<BaseLayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute isAllowed={session && isTauri && !account}>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/reset"
            element={
              // <ProtectedRoute
              //   isAllowed={allowResetPassword && !session && !account}
              // >
              <ResetPassword />
              // </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute isAllowed={isTauri && noHubs} />}>
        <Route path="/getting-started" element={<CreateHub />} />
      </Route>
    </Routes>
  );
}

export const ProtectedRoute = ({ children, isAllowed, redirectTo }: any) => {
  const location = useLocation();

  if (!isAllowed) {
    return (
      <Navigate
        to={redirectTo || location.state?.from?.pathname || "/"}
        state={{ from: location }}
        replace
      />
    );
  }
  return children ? children : <Outlet />;
};

export default function App({}: any) {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
