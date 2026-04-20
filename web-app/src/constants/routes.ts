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
} as const

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]
