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
  },
} as const
