import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <main className="flex h-screen font-futura">
      <Sidebar />
      <div className="h-full w-full overflow-hidden bg-base-200 pr-1">
          <Navbar />
          <Outlet />
      </div>
    </main>
  )
}
