"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Map,
  PlusSquare,
  Bell,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CURRENT_USER } from "@/lib/mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/auth/useAuth"
import { ROUTES } from "@/constants/routes"

const NAV_ITEMS = [
  { href: ROUTES.HOME, icon: Home, label: "Feed" },
  { href: ROUTES.EXPLORE, icon: Search, label: "Explore" },
  { href: ROUTES.MAP, icon: Map, label: "Map" },
  { href: ROUTES.CREATE, icon: PlusSquare, label: "Create" },
  { href: ROUTES.NOTIFICATIONS, icon: Bell, label: "Notifications" },
  { href: ROUTES.MESSAGES, icon: MessageCircle, label: "Messages" },
  { href: ROUTES.PROFILE, icon: User, label: "Profile" },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-border bg-card xl:w-[280px]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          {/* <Camera className="h-5 w-5 text-primary-foreground" /> */}
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold tracking-tight text-foreground">
            VPS
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Vietnam Photo Scout
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", isActive && "text-primary")}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {item.label}
                  {item.href === "/notifications" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      3
                    </span>
                  )}
                  {item.href === "/messages" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      2
                    </span>
                  )}
                </Link>
              </li>
            )
          })}


        </ul>
      </nav>

      {/* User Profile Bottom */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/profile"
            className="flex flex-1 items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={CURRENT_USER.avatar || "/placeholder.svg"}
                alt={`${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`}
              />
              <AvatarFallback>
                {CURRENT_USER.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">
                {CURRENT_USER.firstName} {CURRENT_USER.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                @{CURRENT_USER.username}
              </p>
            </div>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn đăng xuất khỏi Vietnam Photo Scout không? Phiên làm việc của bạn sẽ kết thúc.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={logout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Đăng xuất
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  )
}
