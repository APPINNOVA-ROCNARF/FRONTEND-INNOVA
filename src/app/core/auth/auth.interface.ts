export interface LoginResponse {
  token: string;
}

export interface UserClaims {
  userId: string;
  email: string;
  role: string;
}
