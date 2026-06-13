import { NextFunction, Request, Response } from "express"
import DbContext from "../database/db"
import { Like } from "../entityes/Like"
import { Idea } from "../entityes/Idea";
import { User } from "../entityes/User";
import { verify_jwt } from "../middlewares/create_jwt";

export class like_controller{
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            const {Session} = Req.cookies
            const verify = verify_jwt(Session)

            if (!Session || typeof verify == "undefined")
                return Res.status(404).json("Нет доступа")

            const likeBank = DbContext.getRepository(Like)
            const findAllLikes = await likeBank.find({relations:["idea", "user", 'idea.likes', 'idea.category']})
            const forUser = findAllLikes.filter((x)=>x.user.id == verify.id)
            const send_info = forUser.map((x)=>{
                return {
                    id:x.idea.id,
                    category:x.idea.category,
                    name_idea:x.idea.name_idea,
                    desc:x.idea.desc,
                    pictures:x.idea.pictures,
                    main_picture:x.idea.main_picture,
                    date_create:x.idea.date_create,
                    likes:x.idea.likes.length,
                    user:x.idea.user,
                    need_part:x.idea.need_part,
                    status:x.idea.status
            }
            })
            Res.status(200).json(send_info);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске всех лайков");
        }

    }
    static async getCountByIdeaId(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id)
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные");
            }
            const likeBank = DbContext.getRepository(Like);
            const countResult = await likeBank
            .createQueryBuilder("like")
            .select("COUNT(like.id)", "totalLikes")
            .where("like.idea = :id", { id: parseId })
            .getRawOne();
            Res.status(200).json({ count: parseInt(countResult.totalLikes) }); //считаем число лайков
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при подсчете лайков");
        }
    }


    static async post(Req:Request, Res:Response, next:NextFunction){
        try{
            const {idIdea} = Req.body;
            const getIdIdea = Number(idIdea);
            const {Session} = Req.cookies;
            const verifyToken = verify_jwt(Session)
            if (!verifyToken || !idIdea || typeof verifyToken == "undefined" || isNaN(getIdIdea)) {
                return Res.status(400).json("Не указаны id пользователя или идеи");
              }
            const userBank = DbContext.getRepository(User);
            const ideaBank = DbContext.getRepository(Idea);
            const likeBank = DbContext.getRepository(Like);
            const user = await userBank.findOne({
                where:{id: verifyToken.id}
            });
            const idea = await ideaBank.findOne({
                where:{id: getIdIdea}
            });
            if (!user || !idea) {
                return Res.status(404).json("Пользователь или идея не найдены");
              };
            const ifAlHaveLike = await likeBank.findOne({
                where:{user, idea}
            });
            if(ifAlHaveLike){
                return Res.status(409).json({ error: "Лайк уже поставлен" });
            }
            const createLike = likeBank.create({
                user,
                idea
            });
            await likeBank.save(createLike);
            Res.status(201).json("Лайк поставлен!")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при постановке лайка");
        }
    }
    static async del(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id)
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные");
            }
            const likeBank = DbContext.getRepository(Like);
            const deleteLike = await likeBank.delete({
                id:parseId
            });
            if(!deleteLike.affected){
                return Res.status(404).json("Не найден лайк, который можно удалить")
            }
            console.log(deleteLike, "удален")
            Res.status(200).json("Лайк убран");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при удалении лайка");
        }
    }
}