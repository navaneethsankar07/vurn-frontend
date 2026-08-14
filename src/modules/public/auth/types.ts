export interface RegisterRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

export interface SendOTPResponse {
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface OrganizationSummary {
  name: string;
  slug: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  avatar: string | null;
  is_email_verified: boolean;
  organizations?: OrganizationSummary[];
}

export interface RegisterResponse {
  message: string;
  user: User;
  access: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access: string;
}

export interface GoogleLoginRequest {
  id_token: string;
}

export interface GoogleLoginResponse {
  message: string;
  user: User;
  access: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface RefreshTokenResponse {
  access: string;
}
