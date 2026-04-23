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
import { Category } from "../types/category.type"
import dayjs from "dayjs"

interface CategoryDetailModalProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
}

export function CategoryDetailModal({
  category,
  isOpen,
  onClose,
}: CategoryDetailModalProps) {
  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Chi tiết thể loại</DialogTitle>
          <DialogDescription>
            Thông tin đầy đủ về thể loại sách.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tên:</span>
            <span className="col-span-3 text-lg font-semibold text-foreground">{category.name}</span>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Slug:</span>
            <span className="col-span-3 text-sm font-mono bg-muted p-1 px-2 rounded w-fit">
              {category.slug}
            </span>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Mô tả:</span>
            <div className="col-span-3 text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border">
              {category.description || <span className="italic text-muted-foreground">Không có mô tả</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Ngày tạo</span>
              <span className="text-sm">{dayjs(category.createdAt).format("DD/MM/YYYY HH:mm")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Cập nhật cuối</span>
              <span className="text-sm">{dayjs(category.updatedAt).format("DD/MM/YYYY HH:mm")}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
