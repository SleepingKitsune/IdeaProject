import { NextFunction, Request, Response, Router } from "express";
import { user_controller } from "../controllers/user_controller";



const router = Router();

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.getAll(req,res,next)
});

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.post(req,res,next)
});

router.put("/", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.update(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.del(req,res,next)
});

export default router;

