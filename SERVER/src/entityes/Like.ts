import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"

import { Idea } from "./Idea"
import { User } from "./User"

@Entity()
export class Like{
    @PrimaryGeneratedColumn()
    id!:number //

    @ManyToOne(()=> Idea,(idea)=> idea.likes)//  Лайк привязывается к конкретной идее// СОЕДИНЕНО
    idea!:Idea;

    @ManyToOne(()=> User, (user)=> user.likes) //Лайк ставится конкретным пользователем//СДЕЛАНО
    user!:User;

}

