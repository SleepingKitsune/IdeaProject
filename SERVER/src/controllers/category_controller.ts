import { NextFunction, Request, Response } from "express"
import DbContext from "../database/db";
import { Category } from "../entityes/Category";

export class category_controller{
    static async get(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id);
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Ошибка - неправильные данные");
            }
            const CategoryBank = DbContext.getRepository(Category)
            const findCategory = await CategoryBank.findOne({where:{id:parseId}});
            if(!findCategory){
                return Res.status(400).json("Ошибка - неправильные данные");
            }
            Res.status(200).json(findCategory);
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске категории");
        }

    }
    static async getAll(Req:Request, Res:Response, next:NextFunction){
        try{
            //const sqlCat = "select * from category";
            const CategoryBank = DbContext.getRepository(Category)
            //const findAllCategory = await CategoryBank.query(sqlCat);
            const findAllCategory = await CategoryBank.find();
            if(findAllCategory.length <= 0){
                return Res.status(401).json("Категории не найдены")
            }
            Res.status(200).json(findAllCategory)
        }
        
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при поиске категорий");
        }
    }
    static async post(Req:Request, Res:Response, next:NextFunction){
        try{
            const {category_name} = Req.body
            if(!category_name || typeof category_name != "string"){
                return Res.status(402).json("Не введено наименование категории")
            }
            const CategoryBank = DbContext.getRepository(Category)
            const createCategory = CategoryBank.create({
                category_name:category_name
            })
            await CategoryBank.save(createCategory)
            Res.status(201).json("Категория создана!")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при создании категории");
        }
    }
    static async del(Req:Request, Res:Response, next:NextFunction){
        try{
            const {id} = Req.params;
            const parseId = Number(id)
            if(!id || isNaN(parseId)){
                return Res.status(400).json("Не найдена категория, которую можно удалить")
            }
            const CategoryBank = DbContext.getRepository(Category)
            const deleteCategory = await CategoryBank.delete({
                id:parseId
            })
            if(!deleteCategory.affected){
                return Res.status(400).json("Не найдена категория, которую можно удалить")
            }
            console.log(deleteCategory, "удален")
            Res.status(200).json("Категория успешно удалена")
        }
        catch(e){
            console.log(e)
            Res.status(500).json("Ошибка при удалении категории");
        }
    }
}