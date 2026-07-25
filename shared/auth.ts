export interface AuthUser {
  id: string;
  email: string | undefined;
}

export interface AuthMeResponse {
  user: AuthUser;
}

export interface AuthErrorResponse {
  error: string;
}
