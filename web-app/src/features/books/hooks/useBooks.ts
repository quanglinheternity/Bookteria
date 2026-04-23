"use client"

import { useState, useEffect, useCallback } from "react"
import { bookService } from "../services/book.service"
import { Book, BookSearchRequest } from "../types/book.type"
import { useToast } from "@/hooks/ui/useToast"

export function useBooks(initialCriteria: BookSearchRequest = {}) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [criteria, setCriteria] = useState<BookSearchRequest>({
    page: 1,
    size: 10,
    ...initialCriteria,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 10,
  })
  const { toast } = useToast()

  const fetchBooks = useCallback(async (searchCriteria: BookSearchRequest) => {
    try {
      setIsLoading(true)
      const response = await bookService.searchBooks(searchCriteria)
      if (response.code === 200 || response.code === 1000) {
        setBooks(response.result.data)
        setPagination({
          currentPage: response.result.currentPage,
          totalPages: response.result.totalPages,
          totalElements: response.result.totalElements,
          pageSize: response.result.pageSize,
        })
      } else {
        setError("Không thể tải danh sách sách")
        toast.error("Lỗi", "Không thể tải danh sách sách")
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBooks(criteria)
  }, [criteria, fetchBooks])

  const handleSearch = (newCriteria: Partial<BookSearchRequest>) => {
    setCriteria(prev => ({ ...prev, ...newCriteria, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setCriteria(prev => ({ ...prev, page }))
  }

  return { 
    books, 
    isLoading, 
    error, 
    pagination, 
    criteria, 
    handleSearch, 
    handlePageChange,
    refresh: () => fetchBooks(criteria) 
  }
}

export function useBookDetail(id: number | null) {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchDetail = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const response = await bookService.getBookDetail(id)
      if (response.code === 200 || response.code === 1000) {
        setBook(response.result)
      }
    } catch (err) {
      console.error(err)
      toast.error("Lỗi", "Không thể tải thông tin chi tiết sách")
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { book, isLoading, refresh: fetchDetail }
}
