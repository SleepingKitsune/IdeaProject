import { NextFunction, Request, Response } from "express"
import { User, UserRole } from "../entityes/User"
import DbContext from "../database/db";
import { crypt, compare } from "../middlewares/bcrypt";
import { create_jwt } from "../middlewares/create_jwt";
import { Jwt_payload } from "../objects/jwt_payload";
import { verify_jwt } from "../middlewares/create_jwt";

export class user_controller{
    static async get(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные!");
            }
            const userBank = DbContext.getRepository(User);
            const findUser = await userBank.findOne({
                where:{id:parseId},
                select: ["id", "nickname", "email", "aboutMe"]
            });
            if(!findUser){
                return Res.status(400).json("Ошибка - пользователь не найден");
            }
            Res.status(200).json(findUser);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске пользователя");
        }

    }
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            const userBank = DbContext.getRepository(User);
            const findAllUser = await userBank.find(
                {select: ["id", "nickname", "email", "aboutMe"]}
            );
            if(findAllUser.length <= 0){
                return Res.status(404).json("Пользователи не найдены")
            };
            Res.status(200).json(findAllUser);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске пользователей");
        }
    }
    static async registration(Req:Request, Res:Response, next:NextFunction){
        try{
            const { nickname, email, password} = Req.body;
            if (!nickname || typeof nickname != "string" || !email || typeof email != "string" || !password || typeof password != "string") {
                return Res.status(400).json({ error: "nickname, email и password обязательны" });
            }
            const userBank = DbContext.getRepository(User);
            const findUser = await userBank.findOne({ where: { email:email } });
            if (findUser) {
                return Res.status(409).json({ error: "Пользователь с таким email уже существует" });
            }
            const hashPass = await crypt(password);
            const registrationUser = userBank.create({
                nickname:nickname,
                email:email,
                password:hashPass,
                role:UserRole.EDITOR
            });
            await userBank.save(registrationUser);
            Res.status(201).json("Регистрация успешна");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при регистрации пользователя");
        }
    }
    static async auth(Req:Request, Res:Response, next:NextFunction){
        try{
            const {email, password} = Req.body;
            if (
                !email || typeof email != "string" ||
                !password || typeof password != "string"
            ){
                return Res.status(401).json("Неправильный email или пароль")
            }

            const userBank = DbContext.getRepository(User);
            const findUser = await userBank.findOne({where:{email:email}});
            if(!findUser){
                return Res.status(401).json("Пользователь с таким email не найден");
            }
            if (!(await compare(password, findUser.password))){
                return Res.status(401).json("Неправильный пароль");
            }
            Res.cookie("Session", create_jwt(
                new Jwt_payload(findUser.id, findUser.nickname, findUser.role)), 
                {
                    httpOnly:true,
                    secure:true,
                    sameSite:'lax',
                    maxAge: 1000 * 60 * 60 * 2,
                    path:"/"
                }).status(200).json("Пользователь авторизован")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при авторизации пользователя");
        }
    }
    static async updateUser(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)
            const {nickname, aboutMe} = Req.body;
            if (
                !Session ||
                typeof verifyToken == "undefined" ||
                !nickname || typeof nickname != "string"
            ){
                return Res.status(401).json("Вы не имеете права на изменение")
            }
            const userBank = DbContext.getRepository(User)
            const findUser = await userBank.findOne({where:{id:verifyToken.id}})
            if (!findUser){
                return Res.status(401).json("Пользователь не найден")
            }
            findUser.nickname = nickname;
            findUser.aboutMe = aboutMe;
            await userBank.save(findUser);
            return Res.status(200).json("Профиль успешно обновлен");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при обновлении профиля");
        }
    }
    static async updateEmail(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies
            const verifyToken = verify_jwt(Session)
            const {email} = Req.body;
            if (
                !Session ||
                typeof verifyToken == "undefined" ||
                !email || typeof email != "string"
            ){
                return Res.status(401).json("Вы не имеете права на изменение")
            }
            const userBank = DbContext.getRepository(User)
            const findUser = await userBank.findOne({where:{id:verifyToken.id}})
            if (!findUser){
                return Res.status(401).json("Пользователь не найден")
            }
            findUser.email = email;
            await userBank.save(findUser);
            return Res.status(200).json("Email успешно обновлен");

        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при обновлении email");
        }
    }
    static async updatePassword(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies
            const verifyToken = verify_jwt(Session)
            const {oldPassword, newPassword} = Req.body;
            if (
                !Session ||
                typeof verifyToken == "undefined" ||
                !oldPassword || typeof oldPassword != "string" ||
                !newPassword || typeof newPassword != "string" 
            ){
                return Res.status(401).json("Вы не имеете права на изменение")
            }
            const userBank = DbContext.getRepository(User)
            const findUser = await userBank.findOne({where:{id:verifyToken.id}})
            if (!findUser){
                return Res.status(401).json("Пользователь не найден")
            }
            if(!await compare(oldPassword, findUser.password)){
                return Res.status(401).json("Пароли не совпадают");
            }
            const newHashPass = await crypt(newPassword);
            findUser.password = newHashPass;
            await userBank.save(findUser);
            return Res.status(200).json("Пароль успешно обновлен");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при обновлении пароля");
        }
    }
    static async updateAvatar(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies
            const verifyToken = verify_jwt(Session)
            const ava = <Express.Multer.File>Req.file;
            if (
                !Session ||
                typeof verifyToken == "undefined"
            ){
                return Res.status(401).json("Вы не имеете права на изменение")
            }
            const userBank = DbContext.getRepository(User)
            const findUser = await userBank.findOne({where:{id:verifyToken.id}})
            if (!findUser){
                return Res.status(401).json("Пользователь не найден")
            }
            findUser.avatar = ava.filename;
            await userBank.save(findUser);
            return Res.status(200).json("Аватар успешно обновлен");

        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при обновлении аватара");
        }
    }
    
    static async del(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies
            const verifyToken = verify_jwt(Session)
            if (
                !Session ||
                typeof verifyToken == "undefined"
            ){
                return Res.status(401).json("Вы не имеете права на изменение")
            }
            const userBank = DbContext.getRepository(User)
            const findUser = await userBank.findOne({where:{id:verifyToken.id}});
            if (!findUser){
                return Res.status(401).json("Пользователь не найден")
            };
            await userBank.remove(findUser);
            return Res.status(200).json("Профиль успешно удален");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при удалении профиля");
        }
    }
}