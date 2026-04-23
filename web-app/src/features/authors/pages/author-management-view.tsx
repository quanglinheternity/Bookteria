"use client"

import { useState } from "react"
import { Plus, RefreshCcw, Loader2, UserPlus, Search as SearchIcon } from "lucide-react"
import { useAuthors, useAuthorActions } from "../hooks/useAuthors"
import { AuthorListTable } from "../components/author-list-table"
import { AuthorFormModal } from "../components/author-form-modal"
import { AuthorDetailModal } from "../components/author-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Author } from "../types/author.type"

export function AuthorManagementView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 10
  
  const { 
    authors, 
    isLoading, 
    totalPages,
    refresh,
    handleSearch
  } = useAuthors(currentPage, pageSize)
  
  const { deleteAuthor } = useAuthorActions()
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)

  const onView = (author: Author) => {
    setSelectedAuthor(author)
    setIsDetailModalOpen(true)
  }

  const onEdit = (author: Author) => {
    setSelectedAuthor(author)
    setIsFormModalOpen(true)
  }

  const onCreate = () => {
    setSelectedAuthor(null)
    setIsFormModalOpen(true)
  }

  const onDelete = async (id: number) => {
    const success = await deleteAuthor(id)
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">Quản lý tác giả</h2>
          <p className="text-muted-foreground mt-1">Danh sách những người sáng tạo nên các tác phẩm kinh điển.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refresh()} title="Làm mới">
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> 
            Làm mới
          </Button>
          <Button onClick={onCreate} className="shadow-lg shadow-primary/20">
            <UserPlus className="mr-2 h-4 w-4" /> Thêm tác giả
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm tác giả theo tên, quốc tịch..." 
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
        
        <AuthorListTable 
          authors={authors} 
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
      <AuthorFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => refresh()}
        author={selectedAuthor}
      />

      <AuthorDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        author={selectedAuthor}
      />
    </div>
  )
}
