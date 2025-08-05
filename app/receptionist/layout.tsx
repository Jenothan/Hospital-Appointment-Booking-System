// app/admin/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, LogOut, BellIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSurgeryContext } from "@/contexts/SurgeryContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { unreadCount } = useSurgeryContext()
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "receptionist") {
      logout()
    }
  }, [user, router])

  if (!user) {
   return null
  }

  const handleLogout = () => {
    logout()
    router.push('/home')
    console.log("Logout clicked")
  }

  const navLinks = [
    {label: "Appointments", href: "/receptionist/appointments"},
    { label: "Surgery", href: "/receptionist/surgery" },
    { label: "Slots", href: "/receptionist/slots" },
    { label: "Settings", href: "/receptionist/settings" },
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors px-3 py-1 rounded-full ${
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "hover:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}

              <div className="relative">
                <Link href="/receptionist/message">
                  <BellIcon className="w-5 h-5" />
                </Link>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>


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

