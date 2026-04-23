export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EXPLORE: "/explore",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  MAP: "/map",
  CREATE: "/create",
  BOOKS: "/books",
  BOOK_DETAIL: "/books/:id",
  CATEGORIES: "/categories",
  AUTHORS: "/authors",
} as const

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]
