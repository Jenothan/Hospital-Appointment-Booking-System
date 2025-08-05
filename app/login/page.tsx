import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import DocImg from "@/assets/Doctors-background.jpg"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-start md:gap-4">
          <a href="/home">
            <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex size-8 md:size-10 items-center justify-center rounded-md shadow">
                  <GalleryVerticalEnd className="size-4 md:size-5" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-800">
                    Novacare
                  </h1>
                  <h2 className="text-xl md:text-2xl text-gray-600 -mt-1">
                    Hospital
                  </h2>
                </div>
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center border mx-30 my-10 border-gray-300 rounded-lg shadow-sm">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src={DocImg} alt="login image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"/>
      </div>
    </div>
  )
}
