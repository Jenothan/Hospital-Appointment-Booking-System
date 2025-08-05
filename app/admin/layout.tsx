"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "admin") {
      logout()
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    console.log("Logout clicked");
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Appointments", href: "/admin/appointments" },
    { label: "doctor", href: "/admin/doctor" },
    { label: "Staff", href: "/admin/staff" },
    { label: "Settings", href: "/admin/settings" },
    { label: "User", href: "/admin/user" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-none">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 backdrop-blur-md bg-none">
        <nav className="mx-auto w-full md:max-w-6xl bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 text-white px-4 py-3 shadow-lg rounded-b-lg">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center text-xl font-bold gap-2">
              <GalleryVerticalEnd className="size-5" />
              NovaCare Hospital
            </div>

            {/* Nav Links + User + Logout */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-end">
              {/* Links */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`transition-colors px-3 py-1 rounded-full text-sm md:text-base ${
                      pathname === href
                        ? "bg-white/20 text-white"
                        : "hover:text-slate-300"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Welcome */}
              <span className="text-xs md:text-sm text-white text-right leading-tight">
                Welcome Back <br className="hidden md:block" />
                {user?.name}
              </span>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-white border-white bg-transparent hover:bg-white hover:text-slate-700 rounded-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-24">{children}</main>
    </div>
  )
}
