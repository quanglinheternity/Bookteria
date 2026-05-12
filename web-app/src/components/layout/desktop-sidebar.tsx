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
  Users,
  LogOut,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DEFAULT_AVATAR } from "@/constants/image"
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
import { useAuth } from "@/features/auth"
import { useUser } from "@/features/profile/hooks/useUser"
import { ROUTES } from "@/constants/routes"

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
  { href: ROUTES.ADMIN_POSTS, icon: Sparkles, label: "QL Bài viết" },
]

import { useReaderSettings } from "@/hooks/use-reader-settings"

export function DesktopSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { user, isLoading: isUserLoading } = useUser()
  const { theme } = useReaderSettings()

  const isReaderPage = pathname.includes("/read")
  const isReaderDark = isReaderPage && theme === "dark"

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 hidden h-screen w-[240px] flex-col border-r md:flex xl:w-[280px] transition-all duration-500",
      isReaderDark 
        ? "bg-black border-white/5" 
        : isReaderPage && theme === "sepia"
          ? "bg-[#f4ecd8] border-[#5b4636]/10"
          : "bg-card border-border"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          {/* <Camera className="h-5 w-5 text-primary-foreground" /> */}
        </div>
        <div>
          <h1 className={cn(
            "font-serif text-xl font-bold tracking-tight transition-colors duration-500",
            isReaderDark ? "text-white" : isReaderPage && theme === "sepia" ? "text-[#5b4636]" : "text-foreground"
          )}>
            VPS
          </h1>
          <p className={cn(
            "text-[10px] font-medium uppercase tracking-widest transition-colors duration-500",
            isReaderDark ? "text-white/40" : isReaderPage && theme === "sepia" ? "text-[#5b4636]/60" : "text-muted-foreground"
          )}>
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-500",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isReaderDark 
                        ? "text-white/60 hover:bg-white/10 hover:text-white"
                        : isReaderPage && theme === "sepia"
                          ? "text-[#5b4636]/60 hover:bg-[#5b4636]/5 hover:text-[#5b4636]"
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
      <div className={cn(
        "border-t p-4 transition-colors duration-500",
        isReaderDark ? "border-white/5" : isReaderPage && theme === "sepia" ? "border-[#5b4636]/10" : "border-border"
      )}>
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/profile/${user?.userId || ""}`}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg p-2 transition-all duration-500",
              isReaderDark ? "hover:bg-white/5" : isReaderPage && theme === "sepia" ? "hover:bg-[#5b4636]/5" : "hover:bg-muted"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.avatar || DEFAULT_AVATAR}
                alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className={cn(
                "truncate text-sm font-semibold transition-colors duration-500",
                isReaderDark ? "text-white" : isReaderPage && theme === "sepia" ? "text-[#5b4636]" : "text-foreground"
              )}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className={cn(
                "truncate text-xs transition-colors duration-500",
                isReaderDark ? "text-white/40" : isReaderPage && theme === "sepia" ? "text-[#5b4636]/60" : "text-muted-foreground"
              )}>
                @{user?.username || (user?.username?.split("@")[0])}
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
