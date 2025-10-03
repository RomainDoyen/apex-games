export type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  expires_in?: number;
  message?: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
