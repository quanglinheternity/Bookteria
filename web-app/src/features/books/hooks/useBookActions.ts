"use client"

import { useState } from "react"
import { bookService } from "../services/book.service"
import { BookCreationRequest, BookUpdateRequest } from "../types/book.type"
import { useToast } from "@/hooks/ui/useToast"

export function useBookActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const createBook = async (data: BookCreationRequest) => {
    try {
      setIsSubmitting(true)
      const response = await bookService.createBook(data)
      if (response.code === 201 || response.code === 1000) {
        toast.success("Thành công", "Sách đã được tạo thành công")
        return response.result
      } else {
        toast.error("Lỗi", response.message || "Không thể tạo sách")
        return null
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Đã có lỗi xảy ra khi tạo sách")
      console.error(err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateBook = async (id: number, data: BookUpdateRequest) => {
    try {
      setIsSubmitting(true)
      const response = await bookService.updateBook(id, data)
      if (response.code === 200 || response.code === 1000) {
        toast.success("Thành công", "Cập nhật sách thành công")
        return response.result
      } else {
        toast.error("Lỗi", response.message || "Không thể cập nhật sách")
        return null
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Đã có lỗi xảy ra khi cập nhật sách")
      console.error(err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteBook = async (id: number) => {
    try {
      setIsSubmitting(true)
      const response = await bookService.deleteBook(id)
      if (response.code === 200 || response.code === 1000) {
        toast.success("Thành công", "Đã xóa sách")
        return true
      } else {
        toast.error("Lỗi", "Không thể xóa sách")
        return false
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Đã có lỗi xảy ra khi xóa sách")
      console.error(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createBook, updateBook, deleteBook, isSubmitting }
}
