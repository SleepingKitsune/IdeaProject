import { NextFunction, Request, Response, Router } from "express";
import { picture_controller } from "../controllers/picture_controller";

const router = Router();


router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.getAll(req,res,next)
});

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.post(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.del(req,res,next)
});

export default router;