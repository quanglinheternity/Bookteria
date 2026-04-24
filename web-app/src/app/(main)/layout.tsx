import React from "react"
import { DesktopSidebar } from "@/components/layout/desktop-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 md:ml-[240px] xl:ml-[280px] min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
