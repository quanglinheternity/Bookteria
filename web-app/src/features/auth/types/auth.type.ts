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

export interface RegisterRequest {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  dob: string // LocalDate in backend, string in frontend
  city: string
}

export interface UserResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  dob: string
  city: string
}

export interface RegisterResponse {
  code: number
  message?: string
  result: UserResponse
}
