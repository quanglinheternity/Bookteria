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
import { Edit, Trash2, Eye } from "lucide-react"
import { Author } from "../types/author.type"
import dayjs from "dayjs"
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

interface AuthorListTableProps {
  authors: Author[]
  onView: (author: Author) => void
  onEdit: (author: Author) => void
  onDelete: (id: number) => void
}

export function AuthorListTable({
  authors,
  onView,
  onEdit,
  onDelete
}: AuthorListTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Tên tác giả</TableHead>
            <TableHead>Quốc tịch</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                Chưa có tác giả nào được tạo.
              </TableCell>
            </TableRow>
          ) : (
            authors.map((author) => (
              <TableRow key={author.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={author.avatarUrl || DEFAULT_AVATAR} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{author.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                      {author.bio || "Chưa có tiểu sử"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm px-2 py-1 bg-primary/5 text-primary rounded-full border border-primary/10">
                    {author.nationality || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {author.birthDate ? dayjs(author.birthDate).format("DD/MM/YYYY") : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onView(author)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => onEdit(author)}
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
                            Hành động này không thể hoàn tác. Tác giả "{author.name}" sẽ bị xóa khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(author.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xóa tác giả
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
  )
}
