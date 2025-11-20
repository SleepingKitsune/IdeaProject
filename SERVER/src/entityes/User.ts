import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Idea } from "./Idea"
import { Like } from "./Like"

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    GHOST = "ghost",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nickname!: string

    @Column()
    email!: string

    @Column({
        
        type:"enum",
        enum: UserRole,
        default:UserRole.GHOST
    })
    role!:UserRole

    @Column()
    password!: string

    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[]; 

    @OneToMany(() => Idea, (idea) => idea.user)
    ideas!: Idea[]; // соединяет юзера и идеи. У юзера может быть много идей // СДЕЛАНО

    @Column()
    avatar!: string
    
}