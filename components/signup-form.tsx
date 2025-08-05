"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import signImg from "@/assets/Signup-image.jpg"
import { googleSignIn } from "@/components/googleSignIn"
import google from "../assets/googleIcon1.png"
import { Checkbox } from "./ui/checkbox"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signup, setUser } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long")
      setIsSubmitting(false)
      return
    }

    // Attempt signup
    const success = await signup(formData)
    
    if (success) {
      alert("Account created successfully! You are now logged in.")
      router.push("/login")
    }
    
    setIsSubmitting(false)
  }

  const handleGoogleLogin = async () => {
  const googleUser = await googleSignIn()


  

  if (googleUser) {
    if (!googleUser.email) {
    alert("Google sign-in failed: No email found.")
    return
  }
    const newUser = {
      id: googleUser.uid,
      name: googleUser.displayName || "Unknown",
      email: googleUser.email,
      role: "patient" as const, // Or detect role if needed
    }

    // Save to localStorage (just like regular signup)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userExists = users.some((user: any) => user.email === newUser.email)

    if (!userExists) {
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
    }

    localStorage.setItem('currentUser', JSON.stringify(newUser))

    // Set context
    setUser(newUser)

    // Redirect
    router.push("/login")

    alert("Signed in as " + googleUser.email)
  } else {
    alert("Google login failed")
  }
}


  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden p-0 gap-2 transition-all duration-300 hover:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] hover:scale-103 border border-gray-300 rounded-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your details to sign up as a patient
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type={showPassword ? "text" : "password"}  value={formData.password} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirmPassword" type={showPassword ? "text" : "password"}  value={formData.confirmPassword} onChange={handleChange} required />
              </div>
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
              <Button onClick={handleGoogleLogin} className="w-full bg-gray-200 text-gray-700 hover:text-white hover:bg-pink-400">
                <Image src={google} alt="Google" width={20} height={20} className="rounded-full"/>
                Continue with Google
              </Button>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="hover:underline underline-offset-4 text-blue-700">
                  Log in
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src={signImg}
              alt="Signup Illustration"
              width={400}
              height={600}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}