export interface IUpdateUser {
  tgLink?: string;
  vkLink?: string;
  phone?: string;
  fullname?: string;
  logo?: string;
}

export interface IGetUser {
  userId: string
}
