export interface IRes_user {
  data: IUser
}

export interface ILIke {
  id: number
}

export interface IIdea {
  id: number
}
export default interface IUser {
  id: number,
  nickname: string,
  email: string,
  role: string,
  likes: ILIke[],
  ideas: IIdea[],
  avatar: string,
  aboutMe: string,}
export interface ICategory {
    category: any;
    id: number;
    category_name: string;
  }

export enum EStatus {
    serching='searching',
    in_progress='in_progress',
    complited='completed'
  }