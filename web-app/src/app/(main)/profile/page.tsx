"use client"

import { POSTS } from "@/lib/mock-data"
import { ProfileView } from "@/features/profile/components/profile-view"
import { useUser } from "@/hooks/user/useUser"
import { Loader2 } from "lucide-react"

export default function MyProfilePage() {
  const { userData, isLoading, error, refreshProfile } = useUser()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang tải hồ sơ của bạn...
          </p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
        <div className="rounded-2xl bg-destructive/10 p-6 text-destructive">
          <h2 className="text-xl font-bold">Lỗi tải dữ liệu</h2>
          <p className="mt-2 text-sm text-destructive/80">
            {error || "Không tìm thấy dữ liệu người dùng."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-destructive px-6 py-2 text-sm font-semibold text-destructive-foreground transition-all hover:scale-105 hover:bg-destructive/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProfileView 
      user={userData} 
      posts={POSTS} 
      isOwnProfile 
      onProfileUpdate={refreshProfile}
    />
  )
}
