import { BookReaderView } from "@/features/books/pages/book-reader-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đang đọc | Bookteria",
  description: "Trải nghiệm đọc sách tuyệt vời trên Bookteria.",
}

export default function BookReadPage() {
  return <BookReaderView />
}
