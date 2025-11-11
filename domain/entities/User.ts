export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailVerified: boolean = false,
    public image?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}