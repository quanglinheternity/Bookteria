import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  imageSrc?: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  imageSrc = "/auth-bg.png",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* Left side: Content */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-1/2 xl:p-12">
        <header>
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-foreground">
                VPS
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Vietnam Photo Scout
              </p>
            </div>
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
        </main>

        <footer className="pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Vietnam Photo Scout. All rights reserved.</p>
        </footer>
      </div>

      {/* Right side: Image (Hidden on mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src={imageSrc}
          alt="Scenic Vietnamese landscape"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        {/* Overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Featured Location Info */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <span className="h-px w-8 bg-white/40" />
            Featured Location
          </div>
          <h3 className="mt-2 text-4xl font-bold tracking-tight font-serif">Misty Peaks of Sa Pa</h3>
          <p className="mt-2 text-lg text-white/70">Lào Cai, Vietnam</p>
        </div>
      </div>
    </div>
  )
}
