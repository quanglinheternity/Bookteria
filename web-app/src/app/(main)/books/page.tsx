import { BookManagementView } from "@/features/books/pages/book-management-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý sách | Bookteria",
  description: "Trang quản trị danh mục sách của hệ thống Bookteria.",
}

export default function BooksPage() {
  return <BookManagementView />
}
