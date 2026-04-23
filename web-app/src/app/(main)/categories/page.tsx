import { CategoryManagementView } from "@/features/categories"

export const metadata = {
  title: "Quản lý thể loại | Bookteria",
  description: "Trang quản lý thể loại sách dành cho admin",
}

export default function CategoriesPage() {
  return <CategoryManagementView />
}
