export const API_BASE_URL = "http://localhost:8888"

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/identity/auth/token`,
    LOGOUT: `${API_BASE_URL}/identity/auth/logout`,
    REFRESH: `${API_BASE_URL}/identity/auth/refresh`,
  },
  USER: {
    MY_INFO: `${API_BASE_URL}/profile/users/my-profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/profile/users/my-profile`,
    UPDATE_AVATAR: `${API_BASE_URL}/profile/users/avatar`,
    SEARCH: `${API_BASE_URL}/profile/users/search`,
    GET_PROFILE_BY_USERID: (userId: string) => `${API_BASE_URL}/profile/users/internal/${userId}/detail`,
  },
  CHAT: {
    MY_CONVERSATIONS: `${API_BASE_URL}/chat/conversations/my-conversations`,
    CREATE_CONVERSATION: `${API_BASE_URL}/chat/conversations/create`,
    CREATE_MESSAGE: `${API_BASE_URL}/chat/messages/create`,
    GET_CONVERSATION_MESSAGES: `${API_BASE_URL}/chat/messages`,
  },
  BOOK: {
    BOOKS: `${API_BASE_URL}/book/api/v1/books`,
    CATEGORIES: `${API_BASE_URL}/book/api/v1/categories`,
    AUTHORS: `${API_BASE_URL}/book/api/v1/authors`,
  },
  POST: {
    POSTS: `${API_BASE_URL}/posts/api/v1/posts`,
    COMMENTS: `${API_BASE_URL}/posts/api/v1/comments`,
  },
} as const
