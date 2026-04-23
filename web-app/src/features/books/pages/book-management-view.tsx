"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search as SearchIcon, Filter, RefreshCcw, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { useBooks } from "../hooks/useBooks"
import { useBookActions } from "../hooks/useBookActions"
import { BookListTable } from "../components/book-list-table"
import { BookFormModal } from "../components/book-form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Book, Category, Author } from "../types/book.type"
import { categoryService } from "@/features/categories/services/category.service"
import { authorService } from "@/features/authors/services/author.service"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BookManagementView() {
  const { 
    books, 
    isLoading, 
    pagination, 
    handleSearch, 
    handlePageChange,
    refresh 
  } = useBooks()
  const { deleteBook } = useBookActions()
  const router = useRouter()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter States
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false)
  const [categorySearchKeyword, setCategorySearchKeyword] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  
  const [isAuthorPopoverOpen, setIsAuthorPopoverOpen] = useState(false)
  const [authorSearchKeyword, setAuthorSearchKeyword] = useState("")
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | undefined>(undefined)

  // Debounced Category Search for Filter
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const catRes = await categoryService.getAllCategories(1, 50, categorySearchKeyword)
        if (catRes.code === 200 || catRes.code === 1000) {
          setCategories(catRes.result.data)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [categorySearchKeyword])

  // Debounced Author Search for Filter
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const authRes = await authorService.getAllAuthors(1, 50, authorSearchKeyword)
        if (authRes.code === 200 || authRes.code === 1000) setAuthors(authRes.result.data)
      } catch (err) {
        console.error("Error fetching authors:", err)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [authorSearchKeyword])

  const onDetail = (book: Book) => {
    router.push(`/books/${book.id}`)
  }

  const onEdit = (book: Book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const onCreate = () => {
    setSelectedBook(null)
    setIsModalOpen(true)
  }

  const onDelete = async (id: number) => {
    const success = await deleteBook(id)
    if (success) refresh()
  }

  const triggerSearch = () => {
    handleSearch({ keyword: searchTerm })
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">Quản lý sách</h2>
          <p className="text-muted-foreground mt-1">Quản lý kho sách, thể loại và tác giả của hệ thống.</p>
        </div>
        <Button onClick={onCreate} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Thêm sách mới
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tên sách, ISBN..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
          />
        </div>
        
        <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isCategoryPopoverOpen}
              className="w-[180px] justify-between font-normal"
            >
              <div className="flex items-center overflow-hidden">
                <Filter className="mr-2 h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {selectedCategoryId
                    ? categories.find((c) => c.id.toString() === selectedCategoryId)?.name || "Đang chọn..."
                    : "Thể loại"}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Tìm thể loại..." 
                value={categorySearchKeyword}
                onValueChange={setCategorySearchKeyword}
              />
              <CommandList>
                <CommandEmpty>Không tìm thấy thể loại.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setSelectedCategoryId(undefined)
                      handleSearch({ categoryId: undefined })
                      setIsCategoryPopoverOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !selectedCategoryId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Tất cả thể loại
                  </CommandItem>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.id.toString()}
                      onSelect={(currentValue) => {
                        setSelectedCategoryId(currentValue)
                        handleSearch({ categoryId: parseInt(currentValue) })
                        setIsCategoryPopoverOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategoryId === cat.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={isAuthorPopoverOpen} onOpenChange={setIsAuthorPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isAuthorPopoverOpen}
              className="w-[200px] justify-between font-normal"
            >
              <div className="flex items-center overflow-hidden">
                <Filter className="mr-2 h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {selectedAuthorId
                    ? authors.find((a) => a.id.toString() === selectedAuthorId)?.name || "Đang chọn..."
                    : "Chọn tác giả"}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Tìm tác giả..." 
                value={authorSearchKeyword}
                onValueChange={setAuthorSearchKeyword}
              />
              <CommandList>
                <CommandEmpty>Không tìm thấy tác giả.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setSelectedAuthorId(undefined)
                      handleSearch({ authorId: undefined })
                      setIsAuthorPopoverOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !selectedAuthorId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Tất cả tác giả
                  </CommandItem>
                  {authors.map((author) => (
                    <CommandItem
                      key={author.id}
                      value={author.id.toString()}
                      onSelect={(currentValue) => {
                        setSelectedAuthorId(currentValue)
                        handleSearch({ authorId: parseInt(currentValue) })
                        setIsAuthorPopoverOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAuthorId === author.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {author.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={() => refresh()} title="Làm mới">
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
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
        
        <BookListTable 
          books={books} 
          onView={onDetail}
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Trước
          </Button>
          <div className="flex items-center gap-1 mx-4">
            <span className="text-sm font-medium">{pagination.currentPage}</span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{pagination.totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Modals */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refresh()}
        book={selectedBook}
      />
    </div>
  )
}
