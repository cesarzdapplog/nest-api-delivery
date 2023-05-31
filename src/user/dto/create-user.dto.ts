export class CreateUserDto {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  address: string;
  estatus?: number;
  avatar: string;
  date_created: number;
  date_updated: number;
}
