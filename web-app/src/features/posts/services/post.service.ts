import { postApi } from "../api/post.api"
import { PostCreationRequest, PostUpdateRequest } from "../types/post.type"

export const postService = {
  async createPost(data: PostCreationRequest) {
    return await postApi.create(data)
  },

  async getAllPosts(page?: number, size?: number) {
    return await postApi.getAll(page, size)
  },

  async getMyPosts(page?: number, size?: number) {
    return await postApi.getMyPosts(page, size)
  },

  async getPostsByUserId(userId: string, page?: number, size?: number) {
    return await postApi.getPostsByUserId(userId, page, size)
  },

  async getPostDetail(postId: string) {
    return await postApi.getById(postId)
  },

  async updatePost(postId: string, data: PostUpdateRequest) {
    return await postApi.update(postId, data)
  },

  async deletePost(postId: string) {
    return await postApi.delete(postId)
  },

  async likePost(postId: string) {
    return await postApi.like(postId)
  },

  async unlikePost(postId: string) {
    return await postApi.unlike(postId)
  },

  async uploadMedia(file: File) {
    return await postApi.uploadMedia(file)
  },
}
