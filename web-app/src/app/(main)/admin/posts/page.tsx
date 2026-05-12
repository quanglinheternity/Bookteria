import { Metadata } from "next"
import { AdminPostsView } from "@/features/posts"

export const metadata: Metadata = {
  title: "Quản lý bài viết | Admin",
  description: "Trang quản lý bài viết dành cho quản trị viên",
}

export default function AdminPostsPage() {
  return <AdminPostsView />
}
