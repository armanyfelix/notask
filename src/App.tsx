import "./App.css";
import AppLayout from "./layout/AppLayout";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  redirect,
  useLocation,
} from "react-router-dom";
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

export default function App({}: any) {
  const [allowResetPassword, setAllowResetPassword] = useState<boolean>(false);
  const { account, setAccount } = useAccountStore();
  const { session, setSession } = useSessionStore();
  const { theme, setTheme } = useThemeStore();
  const { setSpaces } = useSpacesStore();

  const getAccount = async (id: string) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  async function getSpaces() {
    if (account) {
      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("account", account?.id);
      if (data?.length) {
        const dataWithImages = await addImageUrl(data);
        setSpaces(dataWithImages);
      }
    }
  }

  useEffect(() => {
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

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        if (session) {
          await getAccount(session.user.id);
          getSpaces();
        }
      } else if (event === "SIGNED_IN") {
        if (session && !allowResetPassword) {
          await getAccount(session.user.id);
          setSession(session);
          getSpaces();
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setAccount(null);
        setSpaces([]);
      } else if (event === "PASSWORD_RECOVERY") {
        setAllowResetPassword(true);
        setSession(null);
        setAccount(null);
        setSpaces([]);
        redirect("/password/reset");
      } else if (event === "TOKEN_REFRESHED") {
        if (session) {
          setSession(session);
        }
      } else if (event === "USER_UPDATED") {
        if (session) {
          setSession(session);
          getAccount(session.user.id);
        }
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [theme]);

  return (
    <BrowserRouter>
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
        <Route element={<ProtectedRoute isAllowed={!session} />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
        </Route>
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
      </Routes>
    </BrowserRouter>
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
