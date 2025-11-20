import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Idea } from "./Idea"

@Entity()
export class Picture{
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    picture_name!:string

    @ManyToOne(()=> Idea, (idea)=> idea.pictures) //Связь с идеей. У одной идеи может быть множество изображений. СДЕЛАНО
    idea!: Idea;
}