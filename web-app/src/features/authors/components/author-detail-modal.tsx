"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Author } from "../types/author.type"
import dayjs from "dayjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DEFAULT_AVATAR } from "@/constants/image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Globe } from "lucide-react"

interface AuthorDetailModalProps {
  author: Author | null
  isOpen: boolean
  onClose: () => void
}

export function AuthorDetailModal({
  author,
  isOpen,
  onClose,
}: AuthorDetailModalProps) {
  if (!author) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Chi tiết tác giả</DialogTitle>
          <DialogDescription>
            Xem thông tin đầy đủ và tiểu sử của tác giả.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-1 ring-border">
            <AvatarImage src={author.avatarUrl || DEFAULT_AVATAR} className="object-cover" />
            <AvatarFallback className="text-3xl">{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{author.name}</h3>
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-primary/5 text-primary border-primary/20">
                <Globe className="h-3.5 w-3.5" />
                {author.nationality || "N/A"}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-muted text-muted-foreground border-border">
                <Calendar className="h-3.5 w-3.5" />
                {author.birthDate ? dayjs(author.birthDate).format("DD/MM/YYYY") : "Chưa rõ"}
              </Badge>
            </div>
          </div>

          <div className="w-full space-y-4 px-2">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Tiểu sử</span>
              <div className="text-sm text-foreground leading-relaxed bg-muted/30 p-5 rounded-2xl border border-border whitespace-pre-wrap">
                {author.bio || <span className="italic text-muted-foreground">Chưa có tiểu sử cho tác giả này.</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-6">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Hồ sơ được tạo lúc</span>
                <span className="text-xs font-medium text-foreground/80">{dayjs(author.createdAt).format("DD/MM/YYYY HH:mm")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Cập nhật lần cuối</span>
                <span className="text-xs font-medium text-foreground/80">{dayjs(author.updatedAt).format("DD/MM/YYYY HH:mm")}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
