import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Idea } from "./Idea"

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    category_name!:string

    @OneToMany(()=> Idea, (idea)=> idea.category) //связывает с идеями: одна категория - много идей
    ideas!:Idea[];
}