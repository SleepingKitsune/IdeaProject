import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Like } from "./Like"
import { User } from "./User"
import { Category } from "./Category"
import { Picture } from "./Picture"

@Entity()
export class Idea{
    @PrimaryGeneratedColumn()
    id!:number // уникальный ключ


    @ManyToOne(()=> Category, (cat)=> cat.ideas) //связывает с таблицей категорий: много идей у одной категории
    category!:Category;

    @Column()
    name_idea!:string //имя идеи

    @Column()
    short_desc!:string // короткое описание

    @Column()
    desc!:string // полное описание

    @OneToMany(()=> Picture, (pic)=> pic.idea)
    pictures!:Picture[];

    @Column()
    main_picture!:string //главная картинка идеи. один к одному с таблицей картинок. (сделать кнопку "сделать главной картинкой")

    @Column()
    date_create!:string

    @OneToMany(()=> Like, (like)=> like.idea) //СДЕЛАНО
    likes!: Like[]

    @ManyToOne(()=> User, (user)=> user.ideas) //Одному пользователю может принадлежать много идей..СДЕЛАНО
    user!:User

    @Column()
    need_part!:boolean

}