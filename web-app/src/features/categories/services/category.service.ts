import { categoryApi } from "../api/category.api"
import { CategoryRequest } from "../types/category.type"

export const categoryService = {
  async createCategory(data: CategoryRequest) {
    return await categoryApi.create(data)
  },

  async getAllCategories(page = 1, size = 10, keyword?: string) {
    return await categoryApi.getAll(page, size, keyword)
  },

  async getCategoryDetail(id: number) {
    return await categoryApi.getById(id)
  },

  async updateCategory(id: number, data: CategoryRequest) {
    return await categoryApi.update(id, data)
  },

  async deleteCategory(id: number) {
    return await categoryApi.delete(id)
  },
}
