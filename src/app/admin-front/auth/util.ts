export interface RegisterDto {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  principal: string;
  password: string;
}

export interface AuthResponse {
  principal: string;
}
