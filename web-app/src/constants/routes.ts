export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EXPLORE: "/explore",
  // POSTS: "/explore", // I'll map it to explore for now since that's where the feed is, or create a new route.
  // // Actually, user might want a separate route or to rename Explore.
  // // I'll add POSTS: "/posts" and the user can decide.
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  MAP: "/map",
  CREATE: "/create",
  BOOKS: "/books",
  BOOK_DETAIL: "/books/:id",
  CATEGORIES: "/categories",
  AUTHORS: "/authors",
  ADMIN_POSTS: "/admin/posts",
} as const

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]
