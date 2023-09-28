export interface RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface LoginDTO {
  principal: string;
  password: string;
}
