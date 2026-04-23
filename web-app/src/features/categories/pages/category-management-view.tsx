"use client"

import { useState } from "react"
import { Plus, RefreshCcw, Loader2, Search as SearchIcon } from "lucide-react"
import { useCategories, useCategoryActions } from "../hooks/useCategories"
import { CategoryListTable } from "../components/category-list-table"
import { CategoryFormModal } from "../components/category-form-modal"
import { CategoryDetailModal } from "../components/category-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category } from "../types/category.type"

export function CategoryManagementView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 10
  
  const { 
    categories, 
    isLoading, 
    totalPages,
    refresh,
    handleSearch
  } = useCategories(currentPage, pageSize)
  
  const { deleteCategory } = useCategoryActions()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const onView = (category: Category) => {
    setSelectedCategory(category)
    setIsDetailModalOpen(true)
  }

  const onEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const onCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const onDelete = async (id: number) => {
    const success = await deleteCategory(id)
    if (success) refresh()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const triggerSearch = () => {
    handleSearch(searchTerm)
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">Quản lý thể loại</h2>
          <p className="text-muted-foreground mt-1">Quản lý danh mục các thể loại sách trong hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refresh()} title="Làm mới">
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> 
            Làm mới
          </Button>
          <Button onClick={onCreate} className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Thêm thể loại
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm thể loại theo tên, slug..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
          />
        </div>
        <Button onClick={triggerSearch}>Tìm kiếm</Button>
      </div>

      {/* Table Section */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm font-medium animate-pulse">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}
        
        <CategoryListTable 
          categories={categories} 
          onView={onView}
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </Button>
          <div className="flex items-center gap-1 mx-4">
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refresh()}
        category={selectedCategory}
      />

      <CategoryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  )
}
