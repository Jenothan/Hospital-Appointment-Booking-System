import { SignupForm } from "@/components/signup-form"
import { GalleryVerticalEnd } from "lucide-react"

export default function SignupPage() {
  return (
    
    <div className="bg-slate-200 flex min-h-svh flex-col p-6 md:p-10">
        <div className="flex flex-col">
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
        <div className="flex flex-col items-center">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
      </div>
    </div>
  )
}
