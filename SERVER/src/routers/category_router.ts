import { NextFunction, Request, Response, Router } from "express";
import { category_controller } from "../controllers/category_controller";

const router = Router();

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    category_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    category_controller.getAll(req,res,next)
});

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    category_controller.post(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    category_controller.del(req,res,next)
});

export default router;