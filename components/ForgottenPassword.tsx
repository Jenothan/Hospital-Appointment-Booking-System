"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import emailjs from 'emailjs-com'

interface ForgottenPasswordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgottenPassword({ open, onOpenChange }: ForgottenPasswordProps) {
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email")
  const [email, setEmail] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("") // store OTP in memory

  const { resetPassword } = useAuth()

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSendOtp = () => {
  if (!email.trim()) return alert("Please enter your email")

  // ✅ Check if the email exists in localStorage
  const credentials = JSON.parse(localStorage.getItem("credentials") || "[]")
  const userExists = credentials.some((cred: any) => cred.email === email)

  if (!userExists) {
    alert("This email is not registered in our system.")
    return
  }

  // ✅ Generate OTP and send email
  const otp = generateOtp()
  setGeneratedOtp(otp)

  emailjs.send("service_b95kcve", "template_5wivoiw", {
    to_email: email,
    message: `Your OTP is ${otp}`
  }, "cqr3WyjFG7aVIHnQZ")
    .then(() => {
      alert("OTP sent successfully!")
      setStep("otp")
    })
    .catch((error) => {
      console.error("Email error:", error)
      alert("Failed to send OTP")
    })
}

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setStep("newPassword")
    } else {
      alert("Invalid OTP")
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim()) return alert("Please enter a new password")
    const success = await resetPassword(email, newPassword)
    if (success) {
      alert("Password reset successful!")
      onOpenChange(false)
      // Reset all states
      setStep("email")
      setEmail("")
      setOtpInput("")
      setNewPassword("")
      setGeneratedOtp("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify OTP"}
            {step === "newPassword" && "Reset Password"}
          </DialogTitle>
        </DialogHeader>

        {step === "email" && (
          <div className="grid gap-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button onClick={handleSendOtp}>Send OTP</Button>
          </div>
        )}

        {step === "otp" && (
          <div className="grid gap-4">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="123456"
            />
            <Button onClick={handleVerifyOtp}>Verify</Button>
          </div>
        )}

        {step === "newPassword" && (
          <div className="grid gap-4">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
