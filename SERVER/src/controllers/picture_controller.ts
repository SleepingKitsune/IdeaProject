import { NextFunction, Request, Response } from "express"
import DbContext from "../database/db";
import { Picture } from "../entityes/Picture";
import { Idea } from "../entityes/Idea";
import multer from "multer";

export class picture_controller{
    static async get(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные");
            }
            const pictureBank = DbContext.getRepository(Picture);
            const findPicture = pictureBank.findOne({
                where:{id:parseId}
            });
            if(!findPicture){
                return Res.status(404).json("Картинка не найдена");
            }
            Res.status(200).json(findPicture);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске картинки");
        };
    };
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            
            const pictureBank = DbContext.getRepository(Picture);
            const findAllPicture = await pictureBank.find();
            if(findAllPicture.length <= 0){
                return Res.status(404).json("Картинки не найдены")
            }
            Res.status(200).json(findAllPicture)
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске картинок");
        };
    };
    static async post(Req:Request, Res:Response, next:NextFunction){
        try{
            const {picture_name, idIdea } = Req.body;
            const parseIdIdea = Number(idIdea)
            if(!picture_name || !parseIdIdea || isNaN(parseIdIdea)){
                return Res.status(400).json("Вы не назвали картинку!")
            }
            const pictureIdea = <Express.Multer.File>Req.file;
            if (!pictureIdea) {
                return Res.status(400).json({ error: "Файл картинки не загружен!" });
            }
            const IdeaBank = DbContext.getRepository(Idea);
            const pictureBank = DbContext.getRepository(Picture);
            const findIdea = await IdeaBank.findOne({
                where:{id:parseIdIdea}
            })
            if(!findIdea){
                return Res.status(404).json("Такая идея не была найдена")
            }
            const createPicture = pictureBank.create({
                picture_name:picture_name,
                idea:findIdea
            })
            await pictureBank.save(createPicture)
            Res.status(201).json("Картинка сохранена!")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при создании картинки");
        };
    };
    static async del(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(404).json("Не найдена картинка, которую можно удалить");
            }
            const pictureBank = DbContext.getRepository(Picture);
            const deletePicture = await pictureBank.delete({
                id:parseId
            })
            if(!deletePicture.affected){
                return Res.status(404).json("Не найдена картинка, которую можно удалить")
            }
            console.log(deletePicture, "удалена")
            Res.status(200).json("Категория успешно удалена");
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при удалении картинки");
        }
    };
};