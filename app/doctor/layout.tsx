// app/admin/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children } : { children: React.ReactNode }) {
  const pathname = usePathname()
  const {user, logout} = useAuth();
  const router = useRouter()

  const handleLogout = () => {
    logout();
    console.log("Logout clicked")
  }

  useEffect(() => {
    if (user && user.role !== "doctor") {
      logout()
    }
  }, [user, router])

  if (!user) {
   return null// or a loading spinner if needed
  }

  const navLinks = [
    { label: "Appointments", href: "/doctor/appointments" },
    { label: "Settings", href: "/doctor/settings" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-200">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 backdrop-blur-md bg-none">
  {/* Centered Nav Container */}
  <nav className="mx-auto max-w-6xl w-[1080px] bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 text-white p-2 shadow-lg rounded-b-lg">
        <div className="w-full mx-auto flex justify-between items-center px-6 ">
          {/* Logo */}
          <div className="flex flex-row items-center justify-center text-xl font-bold gap-2">
            <GalleryVerticalEnd className="size-4 md:size-5" />
            NovaCare Hospital
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors px-3 py-1 rounded-full ${
                  pathname === href
                    ? "bg-white/20 text-white"
                    : "hover:text-slate-300"
                }`}
              >
                {label}
              </Link>
            ))}

            {user && (
                <span className="text-white font-medium">
                  Hi, Dr. {user.name}
                </span>
              )}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-white border-white bg-none hover:bg-white hover:text-slate-700 rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20">{children}</main>
    </div>
  )
}

