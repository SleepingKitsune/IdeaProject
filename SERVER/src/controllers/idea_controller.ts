import { NextFunction, Request, Response } from "express"
import DbContext from "../database/db";
import { Idea } from "../entityes/Idea";
import { verify_jwt } from "../middlewares/create_jwt";
export class idea_controller{
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
            });
            if(!findIdea){
                return Res.status(404).json("Ошибка идея не найдена");
            }
            Res.status(200).json(findIdea);

        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске пользователя");
        }

    }
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            const ideaBank = DbContext.getRepository(Idea);
            const findAllIdea = await ideaBank.find();
            if(findAllIdea.length <= 0){
                return Res.status(404).json("Идеи не найдены")
            };
            Res.status(200).json(findAllIdea);
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
            if(!Session || typeof verifyToken == "undefined"){
                return Res.status(401).json("Вы не имеете право на создание идеи")
            }
            if(!name_idea || typeof name_idea != "string" || !desc || typeof desc != "string" ){
                return Res.status(402).json("Не введено наименование идеи")
            }
            const ideaBank = DbContext.getRepository(Idea);
            const newData = new Date().toString();
            const createIdea = ideaBank.create({
                category:category,
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
            const findIdea = await ideaBank.findOne({ where: { id: parseId } });

            if (!findIdea) {
                return Res.status(404).json({ error: "Идея для удаления не найдена" });
            }
            if (findIdea.user.id !== verifyToken.id) {
                return Res.status(403).json("У вас нет прав на редактирование этой идеи");
            }
            
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

            if (!Session || typeof verifyToken === "undefined") {
                return Res.status(401).json("Вы не авторизованы");
            }
            const { id } = Req.params;
            const { pictureId } = Req.body;

            const parseId = Number(id);
            if (!id || isNaN(parseId) || !pictureId) {
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
            findIdea.main_picture = pictureId;
            await ideaBank.save(findIdea);

            return Res.status(200).json("Главная картинка успешно установлена");

        } catch (e) {
            console.error(e);
            Res.status(500).json("Ошибка при установке главной картинки");
        }
}
}