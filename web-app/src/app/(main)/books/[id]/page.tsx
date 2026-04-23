import { BookDetailView } from "@/features/books/pages/book-detail-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết sách | Bookteria",
  description: "Xem thông tin chi tiết về cuốn sách trong hệ thống Bookteria.",
}

export default function BookDetailPage() {
  return <BookDetailView />
}
