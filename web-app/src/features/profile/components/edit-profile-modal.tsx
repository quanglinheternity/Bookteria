"use client"

import { Loader2, Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfile } from "../types/user.type"
import { useEditProfile } from "../hooks/useEditProfile"

interface EditProfileModalProps {
  user: UserProfile
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultAvatar: string
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSuccess,
  defaultAvatar,
}: EditProfileModalProps) {
  const {
    form,
    isLoading,
    avatarPreview,
    fileInputRef,
    onFileChange,
    handleAvatarClick,
    onSubmit,
  } = useEditProfile({ user, onSuccess, onClose })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <Avatar className="h-24 w-24 ring-2 ring-primary/10 ring-offset-2">
                  <AvatarImage src={avatarPreview || user.avatar || defaultAvatar} />
                  <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">Nhấp để thay đổi ảnh đại diện</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Họ" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tên" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Chia sẻ đôi chút về bản thân bạn..."
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
