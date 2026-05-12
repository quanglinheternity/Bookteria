import { bookApi } from "../api/book.api"
import {
  BookCreationRequest,
  BookUpdateRequest,
  BookSearchRequest,
} from "../types/book.type"

export const bookService = {
  async createBook(data: BookCreationRequest) {
    return await bookApi.create(data)
  },

  async searchBooks(params: BookSearchRequest) {
    return await bookApi.search(params)
  },

  async getBookDetail(id: number) {
    return await bookApi.getById(id)
  },

  async updateBook(id: number, data: BookUpdateRequest) {
    return await bookApi.update(id, data)
  },

  async deleteBook(id: number) {
    return await bookApi.delete(id)
  },

  async getBookFile(fileName: string) {
    return await bookApi.downloadFile(fileName)
  },
}
