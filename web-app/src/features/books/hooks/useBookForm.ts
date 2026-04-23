"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Book, Category, Author } from "../types/book.type"
import { useBookActions } from "./useBookActions"
import { categoryService } from "@/features/categories/services/category.service"
import { authorService } from "@/features/authors/services/author.service"

const bookSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(300),
  isbn: z.string().max(20).optional(),
  subtitle: z.string().max(300).optional(),
  description: z.string().optional(),
  publisher: z.string().max(200).optional(),
  publishedYear: z.coerce.number().min(0).optional(),
  pageCount: z.coerce.number().min(1).optional(),
  language: z.string().default("vi"),
  categoryId: z.string().optional(),
  authorIds: z.array(z.string()).default([]),
})

export type BookFormValues = z.infer<typeof bookSchema>

interface UseBookFormProps {
  book?: Book | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function useBookForm({ book, isOpen, onClose, onSuccess }: UseBookFormProps) {
  const { createBook, updateBook, isSubmitting } = useBookActions()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [authorSearch, setAuthorSearch] = useState("")
  const [authorsList, setAuthorsList] = useState<Author[]>([])

  const [categorySearch, setCategorySearch] = useState("")
  const [categoriesList, setCategoriesList] = useState<Category[]>([])

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      isbn: "",
      subtitle: "",
      description: "",
      publisher: "",
      publishedYear: new Date().getFullYear(),
      pageCount: 1,
      language: "vi",
      categoryId: "",
      authorIds: [],
    },
  })

  // Dynamic Author Fetching
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(async () => {
      try {
        const response = await authorService.getAllAuthors(1, 20, authorSearch)
        if (response.code === 200 || response.code === 1000) {
          setAuthorsList(response.result.data)
        }
      } catch (err) {
        console.error("Error searching authors:", err)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [authorSearch, isOpen])

  // Dynamic Category Fetching
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(async () => {
      try {
        const response = await categoryService.getAllCategories(1, 20, categorySearch)
        if (response.code === 200 || response.code === 1000) {
          setCategoriesList(response.result.data)
        }
      } catch (err) {
        console.error("Error searching categories:", err)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [categorySearch, isOpen])

  // Reset form when book or isOpen changes
  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        isbn: book.isbn || "",
        subtitle: book.subtitle || "",
        description: book.description || "",
        publisher: book.publisher || "",
        publishedYear: book.publishedYear,
        pageCount: book.pageCount,
        language: book.language,
        categoryId: book.category?.id?.toString() || "",
        authorIds: book.authors?.map(a => a.id.toString()) || [],
      })
      setCoverPreview(book.coverImageUrl || null)
    } else {
      form.reset({
        title: "",
        isbn: "",
        subtitle: "",
        description: "",
        publisher: "",
        publishedYear: new Date().getFullYear(),
        pageCount: 1,
        language: "vi",
        categoryId: "",
        authorIds: [],
      })
      setCoverPreview(null)
      setCoverFile(null)
      setBookFile(null)
    }
  }, [book, form, isOpen])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookFile(e.target.files?.[0] || null)
  }

  const removeBookFile = () => setBookFile(null)

  const handleSubmit = async (values: BookFormValues) => {
    const requestData = {
      ...values,
      categoryId: values.categoryId ? parseInt(values.categoryId) : undefined,
      authorIds: values.authorIds.map(id => parseInt(id)),
      coverImage: coverFile || undefined,
      bookFile: bookFile || undefined,
    }

    let result
    if (book) {
      result = await updateBook(book.id, requestData)
    } else {
      result = await createBook(requestData as any)
    }

    if (result) {
      onSuccess()
      onClose()
    }
  }

  return {
    form,
    isSubmitting,
    coverPreview,
    bookFile,
    authorSearch,
    authorsList,
    categorySearch,
    categoriesList,
    setAuthorSearch,
    setCategorySearch,
    handleCoverChange,
    handleBookFileChange,
    removeBookFile,
    handleSubmit,
  }
}
