import { authorApi } from "../api/author.api"

export const authorService = {
  async createAuthor(data: any) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return await authorApi.create(formData)
  },

  async getAllAuthors(page = 1, size = 10, keyword?: string) {
    return await authorApi.getAll(page, size, keyword)
  },

  async getAuthorDetail(id: number) {
    return await authorApi.getById(id)
  },

  async updateAuthor(id: number, data: any) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return await authorApi.update(id, formData)
  },

  async deleteAuthor(id: number) {
    return await authorApi.delete(id)
  },
}
