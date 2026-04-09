import { NextFunction, Request, Response, Router } from "express";
import { like_controller } from "../controllers/like_controller";

const router = Router();


router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    like_controller.getAll(req,res,next)
});

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    like_controller.post(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    like_controller.del(req,res,next)
});

export default router;