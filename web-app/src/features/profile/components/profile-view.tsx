"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Settings,
  Grid3X3,
  Bookmark,
  MapPin,
  Camera,
  Award,
  Heart,
  Loader2,
  Table as FeedIcon,
} from "lucide-react"
import { PostCard, usePosts, PostDetailDialog } from "@/features/posts"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfileModal } from "./edit-profile-modal"
import { PostResponse } from "@/features/posts/types/post.type"
import { UserProfile } from "../types/user.type"
import { userService } from "../services/user.service"
import { useProfileActions } from "../hooks/useProfileActions"
import { useToast } from "@/hooks/ui/useToast"
import { DEFAULT_AVATAR } from "@/constants/image"

interface ProfileViewProps {
  user: UserProfile
  posts: PostResponse[]
  isOwnProfile?: boolean
  showBackButton?: boolean
  onProfileUpdate?: () => void
}

export function ProfileView({
  user,
  posts,
  isOwnProfile = false,
  showBackButton = false,
  onProfileUpdate,
}: ProfileViewProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid")
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null)

  const {
    following,
    followersCount,
    isFollowLoading,
    isAvatarUploading,
    isEditModalOpen,
    setIsEditModalOpen,
    isMessageLoading,
    handleFollow,
    handleMessage,
    handleAvatarUpload
  } = useProfileActions(user, onProfileUpdate)

  const { 
    posts: userPosts, 
    isLoading: isPostsLoading, 
    pagination, 
    refresh: refreshPosts 
  } = usePosts(user.userId, 1, 10, isOwnProfile)
  const savedPosts = posts.filter((p: any) => p.isSaved)

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleAvatarUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen">
      {/* Hidden File Input for Direct Upload */}
      {isOwnProfile && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-1.5 text-foreground hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg font-bold text-foreground">
            {user.username}
          </h2>
        </div>
        {isOwnProfile && (
          <Link
            href="/settings"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        )}
      </header>

      {/* Profile Info - Desktop Layout */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex gap-10">
          <div
            className={cn(
              "relative group h-32 w-32 shrink-0 rounded-full overflow-hidden",
              isOwnProfile && "cursor-pointer transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handleAvatarClick}
          >
            <Avatar className="h-full w-full ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
              <AvatarImage src={user.avatar || DEFAULT_AVATAR} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-3xl">
                {user.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                isAvatarUploading ? "bg-black/40 opacity-100" : "bg-black/20 opacity-0 group-hover:opacity-100"
              )}>
                {isAvatarUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-xs text-primary"
              >
                <Award className="h-3 w-3" />
                {user.level}
              </Badge>
            </div>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>

            {/* Stats */}
            <div className="mt-5 flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {pagination.totalElements || 0}
                </span>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {(followersCount || 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {user.followingCount}
                </span>
                <span className="text-xs text-muted-foreground">
                  Following
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-3">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm"
                    size="sm"
                  >
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={cn(
                      "text-sm min-w-[100px]",
                      following &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    size="sm"
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                  >
                    {isFollowLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      following ? "Following" : "Follow"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm min-w-[100px]"
                    size="sm"
                    onClick={handleMessage}
                    disabled={isMessageLoading}
                  >
                    {isMessageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Message"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stat Highlights */}
        <div className="mt-6 flex gap-3">
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Camera className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {userPosts.length} photos
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {user.level}
            </span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="text-xs font-medium">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-xs font-medium">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="flex justify-end px-4 py-2 gap-2 border-b border-border/50 bg-muted/10">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "feed" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("feed")}
              >
                <FeedIcon className="h-4 w-4" />
              </Button>
            </div>

            {userPosts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-3 gap-1 p-1 lg:grid-cols-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post as any)}
                      className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
                    >
                      {post.imageUrls && post.imageUrls.length > 0 ? (
                        <img
                          src={post.imageUrls[0]}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-1.5 text-white">
                          <Heart className="h-5 w-5 fill-current" />
                          <span className="font-bold">{post.likeCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
                  {userPosts.map((post) => (
                    <PostCard key={post.id} post={post as any} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Camera className="h-12 w-12" strokeWidth={1} />
                <p className="mt-3 text-sm">No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1 lg:grid-cols-4">
                {savedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post as any)}
                    className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
                  >
                    <Image
                      src={post.imageUrls?.[0] || post.images?.[0] || "/placeholder.svg"}
                      alt="Saved post"
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      sizes="(max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bookmark className="h-12 w-12" strokeWidth={1} />
                <p className="mt-3 text-sm">No saved posts</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {isOwnProfile && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => onProfileUpdate?.()}
          defaultAvatar={DEFAULT_AVATAR}
        />
      )}

      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          open={!!selectedPost}
          onOpenChange={(open) => !open && setSelectedPost(null)}
          onCommentCountChange={() => refreshPosts()}
        />
      )}
    </div>
  )
}
