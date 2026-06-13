export interface IPecture {
    id: number
    picture_name: string
}

export interface ICategory {
    id: number
    category_name: string
} 

export interface IIdea {
    id: number
    category: number
    name_idea: string
    desc: string
    pictures: IPecture[]
    main_picture: string
    date_create: string
    likes: number
    status: string
    need_part: boolean
    user: string
}