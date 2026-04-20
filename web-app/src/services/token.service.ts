/**
 * Token Service
 * Handles all cookie-based token storage and retrieval logic.
 */
class TokenService {
  /**
   * Saves both access and refresh tokens in cookies with a 7-day expiration.
   */
  setTokens(token: string, refreshToken: string, expiryTime: string) {
    if (typeof document === "undefined") return

    // Set cookie for 7 days to allow Axios to handle token refresh even after access token expires
    const cookieExpiry = new Date()
    cookieExpiry.setDate(cookieExpiry.getDate() + 7)

    const expiryStr = `; path=/; expires=${cookieExpiry.toUTCString()}; SameSite=Lax`

    document.cookie = `auth_token=${token}${expiryStr}`
    document.cookie = `auth_refresh_token=${refreshToken}${expiryStr}`
    document.cookie = `auth_expiry=${expiryTime}${expiryStr}`
  }

  /**
   * Clears all authentication-related cookies.
   */
  clearTokens() {
    if (typeof document === "undefined") return
    const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = `auth_token=; path=/; expires=${pastDate}`
    document.cookie = `auth_refresh_token=; path=/; expires=${pastDate}`
    document.cookie = `auth_expiry=; path=/; expires=${pastDate}`
  }

  /**
   * Retrieves the access token from cookies.
   */
  getToken(): string | null {
    return this.getCookie("auth_token")
  }

  /**
   * Retrieves the refresh token from cookies.
   */
  getRefreshToken(): string | null {
    return this.getCookie("auth_refresh_token")
  }

  /**
   * Checks if a token exists in cookies.
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Helper to retrieve a cookie by name.
   * This is kept private as it's an internal utility.
   */
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
    const cookieName = `${name}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim()
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length)
      }
    }
    return null
  }
}

export const tokenService = new TokenService()
