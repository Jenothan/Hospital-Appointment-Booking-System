"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {ForgottenPassword} from "./ForgottenPassword"
import { googleSignIn } from "@/components/googleSignIn"
import google from "../assets/googleIcon1.png"
import Image from "next/image"
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Checkbox } from "./ui/checkbox"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login, setUser } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await login(formData.email, formData.password)

    if (!success) {
      alert("Login failed. Please check your credentials.")
    }

    setIsSubmitting(false)
  }

const handleGoogleLogin = async () => {
  const googleUser = await googleSignIn()

  if (googleUser && googleUser.email) {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if user already signed up
    const existingUser = users.find((u: any) => u.email === googleUser.email)

    if (!existingUser) {
      alert("User not found. Please sign up first.")
      return
    }

    // Login the existing user
    localStorage.setItem("currentUser", JSON.stringify(existingUser))
    setUser(existingUser)

    // Redirect based on role (optional)
    switch (existingUser.role) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "doctor":
        router.push("/doctor/appointments")
        break
      case "receptionist":
        router.push("/receptionist/appointments")
        break
      case "patient":
      default:
        router.push("/patient/home")
        break
    }

  } else {
    alert("Google login failed or no email found.")
  }
}



  return (
    <div>
    <form className={cn("flex flex-col gap-6 py-3", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and password to continue.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="example@gmail.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              onClick={() => setShowForgotPassword(true)}
              className="ml-auto text-sm text-blue-700 underline-offset-4 hover:underline cursor-pointer"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}  
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <div className="flex flex-row gap-3 justify-start items-center">
            <Checkbox
                  className="border-gray-400"
                  checked={showPassword}
                  onCheckedChange={(checked) => setShowPassword(Boolean(checked))}
                  id="showPassword"
                />
                <Label htmlFor="showPassword" className="cursor-pointer select-none">
                  Show password
                </Label>
          </div>
          
        </div>

        <Button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-gray-200 text-gray-700 hover:text-white hover:bg-pink-400"
        >
          <Image src={google} alt="Google" width={20} height={20} className="rounded-full" />
          Continue with Google
        </Button>


        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline-offset-4 hover:underline text-blue-700">
          Sign up
        </a>
      </div>
    </form>
    <ForgottenPassword open={showForgotPassword} onOpenChange={setShowForgotPassword} />
</div>
    
  )
}
