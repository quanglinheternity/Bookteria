import { AuthorManagementView } from "@/features/authors"

export const metadata = {
  title: "Quản lý tác giả | Bookteria",
  description: "Trang quản lý tác giả dành cho admin",
}

export default function AuthorsPage() {
  return <AuthorManagementView />
}
