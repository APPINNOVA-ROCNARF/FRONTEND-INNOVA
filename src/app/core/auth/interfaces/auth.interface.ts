export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserClaims {
  userId: string;
  email: string;
  role: string;
}
