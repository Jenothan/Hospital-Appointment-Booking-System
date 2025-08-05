"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const {logout, user} = useAuth()

  useEffect(() => {
    if (user && user.role !== "patient") {
      logout()
    }
  }, [user, router])

  if (!user) {
    return null // or a loading spinner if needed
  }

  const handleLogout = () => {
    logout();
    
  }



  const navLinks = [
    { label: "Home", href: "/patient/home" },
    { label: "Appointments", href: "/patient/appointments" },
    { label: "About Us", href: "/patient/about" },
    { label: "Settings", href: "/patient/settings" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-200">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
              <span>
                Hi {user.name}!
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

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
