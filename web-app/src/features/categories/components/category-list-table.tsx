"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye, Info } from "lucide-react"
import { Category } from "../types/category.type"
import dayjs from "dayjs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

interface CategoryListTableProps {
  categories: Category[]
  onView: (category: Category) => void
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

export function CategoryListTable({
  categories,
  onView,
  onEdit,
  onDelete
}: CategoryListTableProps) {
  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Tên thể loại</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                Chưa có thể loại nào được tạo.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-muted-foreground">{category.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{category.name}</span>
                    {category.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground truncate max-w-[250px] cursor-help">
                            {category.description}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[300px] break-words">
                          {category.description}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {dayjs(category.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onView(category)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Thể loại "{category.name}" sẽ bị xóa vĩnh viễn khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xóa thể loại
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    </TooltipProvider>
  )
}
