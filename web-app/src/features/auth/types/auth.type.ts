export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  code: number
  result: {
    token: string
    refreshToken: string
    expiryTime: string
  }
}

export interface LogoutRequest {
  token: string
}

export interface RefreshTokenRequest {
  token: string
}

export interface RefreshTokenResponse {
  code: number
  result: {
    token: string
    refreshToken: string
    expiryTime: string
  }
}
