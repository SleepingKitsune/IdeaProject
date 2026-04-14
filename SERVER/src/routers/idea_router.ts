import { NextFunction, Request, Response, Router } from "express";
import { idea_controller } from "../controllers/idea_controller";


const router = Router();

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.getAll(req,res,next)
});

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.post(req,res,next)
});

router.put("/:id", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.update(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.del(req,res,next)
});

router.put("/:id/setMainPicture", (req:Request, res:Response, next:NextFunction)=>{
    idea_controller.setMainPicture(req,res,next)
});

export default router;

