import './styles.css'
import AppLayout from './layout'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  redirect,
  useLocation,
} from 'react-router-dom'
import {
  AccountState,
  SessionState,
  ThemeState,
  useAccountStore,
  useSessionStore,
  useThemeStore,
} from './utils/zustand'
import Signin from './pages/auth/Signin'
import Home from './pages/Home'
import Upcoming from './pages/lists/Upcoming'
import List from './pages/lists/List'
import Signup from './pages/auth/Signup'
import Welcome from './pages/Welcome'
import NotFound from './pages/NotFound'
import { useEffect } from 'react'
import ForgotPassword from './pages/auth/ForgotPassword'
import supabase from './utils/supabase'
import ResetPassword from './pages/auth/ResetPassword'
import { signal } from '@preact/signals-react'

const allowResetPassword = signal<boolean>(false)

export default function App({}: any) {
  const { account, setAccount } = useAccountStore((s: AccountState) => s)
  const { session, setSession } = useSessionStore((s: SessionState) => s)
  const { theme, setTheme } = useThemeStore((a: ThemeState) => a)

  const getAccount = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', id)
        .single()
      if (data) {
        setAccount(data)
      }
      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!theme) {
      if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
        setTheme('dark')
      } else {
        setTheme('light')
      }
    } else {
      setTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const newTheme = event.matches ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
      })

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session) {
          // console.log('initial')
          getAccount(session.user.id)
        }
      } else if (event === 'SIGNED_IN') {
        if (session && !allowResetPassword.value) {
          console.log('signin')
          await getAccount(session.user.id)
          setSession(session)
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setAccount(null)
        // redirect('/signin')
      } else if (event === 'PASSWORD_RECOVERY') {
        allowResetPassword.value = true
        setSession(null)
        setAccount(null)
        // console.log('redirect')
        redirect('/password/reset')
      } else if (event === 'TOKEN_REFRESHED') {
        if (session) {
          setSession(session)
        }
      } else if (event === 'USER_UPDATED') {
        if (session) {
          setSession(session)
          getAccount(session.user.id)
        }
      }
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute
              isAllowed={session && account}
              redirectTo={
                !session ? '/signin' : session && !account && '/welcome'
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
            <ProtectedRoute isAllowed={session && !account}>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/reset"
          element={
            // <ProtectedRoute
            //   isAllowed={allowResetPassword.value && !session && !account}
            // >
            <ResetPassword />
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export const ProtectedRoute = ({ children, isAllowed, redirectTo }: any) => {
  const location = useLocation()

  if (!isAllowed) {
    return (
      <Navigate
        to={redirectTo || location.state?.from?.pathname || '/'}
        state={{ from: location }}
        replace
      />
    )
  }
  return children ? children : <Outlet />
}
