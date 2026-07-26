import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { addImageUrl } from "./helpers/images";
import AppLayout from "./layout/AppLayout";
import BaseLayout from "./layout/BaseLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import List from "./pages/lists/List";
import Upcoming from "./pages/lists/Upcoming";
import NotFound from "./pages/NotFound";
import isTauri from "./utils/isTauri";
import supabase from "./utils/supabase";
import {
  useAccountStore,
  useSessionStore,
  useSpacesStore,
  useThemeStore,
} from "./utils/zustand";

const Note = lazy(() => import("./pages/notes/Note"));
const InitialSetup = lazy(() => import("./pages/InitialSetup"));
const Welcome = lazy(() => import("./pages/Welcome"));

function AppRoutes() {
  const { account, setAccount } = useAccountStore();
  const { session, setSession } = useSessionStore();
  const { theme, setTheme } = useThemeStore();
  const { setSpaces } = useSpacesStore();

  const [allowResetPassword, setAllowResetPassword] = useState<boolean>(false);
  const [noVaults, setNoVaults] = useState<boolean>(false);
  const navigate = useNavigate();

  const getVaults = async () => {
    if (!isTauri) return;

    try {
      const { migrateHubsToVaults } = await import("./utils/vaults");
      const vaultsStore = await migrateHubsToVaults();
      const vaultsLength = await vaultsStore.length();
      if (vaultsLength <= 0) {
        setNoVaults(true);
        navigate("/getting-started");
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function getAccount(id: string) {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", id)
      .single();
    if (data) {
      setAccount(data);
    }
    if (error) {
      console.log(error);
    }
  }

  async function getSpaces() {
    if (account) {
      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("account", account.id);
      if (data?.length) {
        const dataWithImages = await addImageUrl(data);
        setSpaces(dataWithImages);
      }
    }
  }

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
    return supabase.auth.onAuthStateChange(async (event, currentSession) => {
      switch (event) {
        case "INITIAL_SESSION":
          if (currentSession) {
            setSession(currentSession);
            await getAccount(currentSession.user.id);
            getSpaces();
          }
          break;
        case "SIGNED_IN":
          if (currentSession) {
            getAccount(currentSession.user.id);
            setSession(currentSession);
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
          if (currentSession) {
            setSession(currentSession);
          }
          break;
        case "USER_UPDATED":
          if (currentSession) {
            setSession(currentSession);
            getAccount(currentSession.user.id);
          }
          break;
        default:
          break;
      }
    });
  };

  useEffect(() => {
    applyTheme();
  }, [theme]);

  useEffect(() => {
    if (isTauri) getVaults();
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
              !isTauri
                ? "/signin"
                : !account
                  ? "/welcome"
                  : "/"
            }
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Home />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/list/:id" element={<List />} />
          <Route
            path="/note"
            element={
              <Suspense fallback={null}>
                <Note />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route
        element={
          <ProtectedRoute
            isAllowed={
              !isTauri ? !session || !account : !session && !account
            }
          />
        }
      >
        <Route element={<BaseLayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
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
      <Route
        element={
          <ProtectedRoute isAllowed={Boolean(session && isTauri && !account)} />
        }
      >
        <Route element={<BaseLayout />}>
          <Route
            path="/welcome"
            element={
              <Suspense fallback={null}>
                <Welcome />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoute isAllowed={isTauri && noVaults} />}>
        <Route
          path="/getting-started"
          element={
            <Suspense fallback={null}>
              <InitialSetup />
            </Suspense>
          }
        />
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

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
