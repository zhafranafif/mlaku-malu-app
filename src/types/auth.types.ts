export interface UserLoginInterface {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface RequestUserInterface extends Request {
  user: UserLoginInterface;
}

export interface CommonResponseInterface<T> {
  code: number;
  message: string;
  data: T;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface RegisterInterface {
  username: string;
  name: string;
  email: string;
}
