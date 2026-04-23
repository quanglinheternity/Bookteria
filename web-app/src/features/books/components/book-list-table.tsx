"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Book } from "../types/book.type"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, BookOpen, User, Eye, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface BookListTableProps {
  books: Book[]
  onView: (book: Book) => void
  onEdit: (book: Book) => void
  onDelete: (id: number) => void
}

export function BookListTable({ books, onView, onEdit, onDelete }: BookListTableProps) {
  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[80px]">Bìa</TableHead>
            <TableHead>Thông tin sách</TableHead>
            <TableHead className="hidden md:table-cell">ISBN</TableHead>
            <TableHead className="hidden lg:table-cell">Thể loại</TableHead>
            <TableHead className="hidden xl:table-cell">Tác giả</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Không tìm thấy cuốn sách nào.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <div className="relative aspect-[2/3] w-12 overflow-hidden rounded shadow-sm">
                    <img
                      src={book.coverImageUrl || "/placeholder-book.png"}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground line-clamp-1">{book.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 italic">
                      {book.publisher} {book.publishedYear ? `(${book.publishedYear})` : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <code className="text-xs font-mono">{book.isbn || "N/A"}</code>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {book.category && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {book.category.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {book.authors?.map((author) => (
                      <Badge key={author.id} variant="secondary" className="px-1 text-[10px]">
                        {author.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onView(book)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => onEdit(book)}
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
                            Hành động này không thể hoàn tác. Cuốn sách "{book.title}" sẽ bị xóa vĩnh viễn khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(book.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xóa sách
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
