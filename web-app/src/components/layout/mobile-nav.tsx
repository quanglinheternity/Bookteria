"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  BookOpen,
  Layers,
  Users,
  Home,
  Search,
  PlusSquare,
  Bell,
  MessageCircle,
  User,
  Map,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: ROUTES.HOME, icon: Home, label: "Feed" },
  { href: ROUTES.EXPLORE, icon: Search, label: "Explore" },
  // { href: ROUTES.POSTS, icon: Sparkles, label: "Bài viết" },
  { href: ROUTES.MAP, icon: Map, label: "Map" },
  { href: ROUTES.BOOKS, icon: BookOpen, label: "Books" },
  { href: ROUTES.CATEGORIES, icon: Layers, label: "Categories" },
  { href: ROUTES.AUTHORS, icon: Users, label: "Authors" },
  { href: ROUTES.CREATE, icon: PlusSquare, label: "Create" },
  { href: ROUTES.NOTIFICATIONS, icon: Bell, label: "Notifications" },
  { href: ROUTES.MESSAGES, icon: MessageCircle, label: "Messages" },
  { href: ROUTES.PROFILE, icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-serif text-lg font-bold tracking-tight">Bookteria</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 text-left border-b">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold">Bookteria</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
