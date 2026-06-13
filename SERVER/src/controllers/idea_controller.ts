import { NextFunction, Request, Response } from "express"
import DbContext from "../database/db";
import { Idea } from "../entityes/Idea";
import { verify_jwt } from "../middlewares/create_jwt";
import { Category } from "../entityes/Category";
import { User } from "../entityes/User";
import { Like } from "../entityes/Like";
import { Picture } from "../entityes/Picture";
export class idea_controller{
  static async getMyIdeas(Req: Request, Res: Response, next: NextFunction) {
    try {
        const { Session } = Req.cookies;
        const verifyToken = verify_jwt(Session);

        if (!Session || typeof verifyToken === "undefined") {
            return Res.status(401).json({ error: "Вы не авторизованы" });
        }
        const userBank = DbContext.getRepository(User); 
        
        const user = await userBank.findOne({
            where: { id: verifyToken.id },
            relations: ['ideas']
        });

        if (!user) {
            return Res.status(404).json({ error: "Пользователь не найден" });
        }
        Res.status(200).json(user.ideas);

    } catch (e) {
        console.error("Ошибка в getMyIdeas:", e);
        Res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
}


    static async get(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные идеи!");
            }
            const ideaBank = DbContext.getRepository(Idea);
            const findIdea = await ideaBank.findOne({
                where:{id:parseId},
                relations:['category', "likes", "user"]
            });
            if(!findIdea){
                return Res.status(404).json("Ошибка идея не найдена");
            }
            const x = findIdea
            Res.status(200).json({
                id:x.id,
                category:x.category,
                name_idea:x.name_idea,
                desc:x.desc,
                pictures:x.pictures,
                main_picture:x.main_picture,
                date_create:x.date_create,
                likes:x.likes.length,
                user:{
                    id: x.user.id,
                    nickname: x.user.nickname
                },
                need_part:x.need_part,
                status:x.status
        });

        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске пользователя");
        }

    }
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            const ideaBank = DbContext.getRepository(Idea);
            const findAllIdea = await ideaBank.find({relations:['category', 'likes', 'user']});
            if(findAllIdea.length <= 0){
                return Res.status(404).json("Идеи не найдены")
            };
            const send_info = findAllIdea.map((x)=>{
                return {
                    id:x.id,
                    category:x.category,
                    name_idea:x.name_idea,
                    desc:x.desc,
                    pictures:x.pictures,
                    main_picture:x.main_picture,
                    date_create:x.date_create,
                    likes:x.likes.length,
                    user:x.user.nickname,
                    need_part:x.need_part,
                    status:x.status
            }
            })
            Res.status(200).json(send_info);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске идей");
        }
    }
    static async getAllForUser(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)
            if(!Session || typeof verifyToken == "undefined"){
                return Res.status(401).json("Вы не имеете право на получение идеи")
            }
            const ideaBank = DbContext.getRepository(Idea);
            const findAllIdea = await ideaBank.find({relations:['category', 'user', 'likes']});
            if(findAllIdea.length <= 0){
                return Res.status(404).json("Идеи не найдены")
            };
            const forUser:Idea[] = findAllIdea.filter((x)=>x.user.id == verifyToken.id)
                const send_info = forUser.map((x)=>{
                    return {
                        id:x.id,
                        category:x.category,
                        name_idea:x.name_idea,
                        desc:x.desc,
                        pictures:x.pictures,
                        main_picture:x.main_picture,
                        date_create:x.date_create,
                        likes:x.likes.length,
                        user:x.user,
                        need_part:x.need_part,
                        status:x.status
                }
                })
                Res.status(200).json(send_info);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске идей");
        }
    }
    static async getAllForUserNonAuth(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id)
            if(!id || isNaN(parseId)){
                return Res.status(401).json("Вы не имеете право на получение идеи")
            }
            const ideaBank = DbContext.getRepository(Idea);
            const findAllIdea = await ideaBank.find({relations:['category', 'user', 'likes']});
            if(findAllIdea.length <= 0){
                return Res.status(404).json("Идеи не найдены")
            };
            const forUser:Idea[] = findAllIdea.filter((x)=>x.user.id == parseId)
                const send_info = forUser.map((x)=>{
                    return {
                        id:x.id,
                        category:x.category,
                        name_idea:x.name_idea,
                        desc:x.desc,
                        pictures:x.pictures,
                        main_picture:x.main_picture,
                        date_create:x.date_create,
                        likes:x.likes.length,
                        user:x.user,
                        need_part:x.need_part,
                        status:x.status
                }
                })
                Res.status(200).json(send_info);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске идей");
        }
    }
    static async post(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)
            const { category, name_idea, desc,  need_part, status} = Req.body;
            const categoryrepo = DbContext.getRepository(Category);
            const findcategory = await categoryrepo.findOne({where:{id:category}})
            if (!findcategory)
                return Res.status(404).json("qwe")
            if(!Session || typeof verifyToken == "undefined"){
                return Res.status(401).json("Вы не имеете право на создание идеи")
            }
            if(!name_idea || typeof name_idea != "string" || !desc || typeof desc != "string" ){
                return Res.status(402).json("Не введено наименование идеи")
            }
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id: verifyToken.id}})
            if (!findUser)
                return Res.status(404).json("Пользователь не найлен")

            const ideaBank = DbContext.getRepository(Idea);
            const newData = new Date().toString();
            const createIdea = ideaBank.create({
                user: findUser,
                category:findcategory,
                name_idea:name_idea,
                desc:desc,
                need_part:need_part,
                status:status,
                date_create: newData
            });
            await ideaBank.save(createIdea);
            Res.status(201).json("Идея создана!")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при создании идеи");
        }
    }
    static async update(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)
            if(!Session || typeof verifyToken == "undefined"){
                return Res.status(401).json("Вы не имеете право на редактирование идеи")
            }
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные идеи!");
            }
            const ideaBank = DbContext.getRepository(Idea);
            const findIdea = await ideaBank.findOne({ where: { id: parseId }, relations: ["user"] }); ;

            if (!findIdea) {
                return Res.status(404).json({ error: "Идея для обновления не найдена" });
            }
            if (findIdea.user.id !== verifyToken.id) {
                return Res.status(403).json("У вас нет прав на редактирование этой идеи");
            }
            const { name_idea, desc, category, need_part, status } = Req.body;
            if(category !== undefined)findIdea.category = category;
            if(name_idea!== undefined)findIdea.name_idea = name_idea;
            if(desc !== undefined)findIdea.desc = desc;
            if(need_part !== undefined)findIdea.need_part = need_part;
            if(status !== undefined)findIdea.status = status;

            await ideaBank.save(findIdea);
            Res.status(200).json("Идея обновлена!");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при обновлении идеи");
        }
    }
    static async del(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)

            if(!Session || typeof verifyToken == "undefined"){
                return Res.status(401).json("Вы не имеете право на удаление идеи")
            }

            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные идеи!");
            }

            const ideaBank = DbContext.getRepository(Idea);
            const findIdea = await ideaBank.findOne({ where: { id: parseId }, relations:['user', 'pictures', 'likes'] });

            if (!findIdea) {
                return Res.status(404).json({ error: "Идея для удаления не найдена" });
            }
            if (findIdea.user.id != verifyToken.id) {
                return Res.status(403).json("У вас нет прав на редактирование этой идеи");
            }
            const likesRepo = DbContext.getRepository(Like)
            const pictuteRepo = DbContext.getRepository(Picture)

            await pictuteRepo.delete({idea:findIdea})
            await likesRepo.delete({idea:findIdea})
            await ideaBank.remove(findIdea);
            return Res.status(200).json("Идея успешно удалена");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при удалении идеи");
        }
    }
    static async setMainPicture(Req: Request, Res: Response, next: NextFunction) {
        try {

            const { Session } = Req.cookies;
            const verifyToken = verify_jwt(Session);
            const fileName = <Express.Multer.File>Req.file;
            if (fileName == undefined)
                return Res.status(404).json("Нет картинки")

            if (!Session || typeof verifyToken === "undefined") {
                return Res.status(401).json("Вы не авторизованы");
            }
            const { id } = Req.params;

            const parseId = Number(id);
            if (!id || isNaN(parseId)) {
                return Res.status(400).json("Неверный ID идеи или не указана картинка");
            }

            const ideaBank = DbContext.getRepository(Idea);

            const findIdea = await ideaBank.findOne({
                where: { id: parseId },
                relations: ["user"]
            });

            if (!findIdea) {
                return Res.status(404).json({ error: "Идея не найдена" });
            }
            if (findIdea.user.id !== verifyToken.id) {
                return Res.status(403).json("У вас нет прав на изменение этой идеи");
            }
            findIdea.main_picture = fileName.filename;
            await ideaBank.save(findIdea);

            return Res.status(200).json("Главная картинка успешно установлена");

        } catch (e) {
            console.error(e);
            Res.status(500).json("Ошибка при установке главной картинки");
        }
}
}