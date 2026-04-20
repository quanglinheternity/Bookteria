import React from "react"
import { DesktopSidebar } from "@/components/layout/desktop-sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="ml-[240px] xl:ml-[280px]">{children}</main>
    </div>
  )
}
