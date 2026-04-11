import { NextFunction, Request, Response, Router } from "express";
import { picture_controller } from "../controllers/picture_controller";
import { uploadImg } from "../middlewares/upload_middleware";
import multer from "multer";

const router = Router();
const upload = multer({storage:uploadImg("../static")})


router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.getAll(req,res,next)
});

router.post("/", upload.single("pictureForIdea"),(req:Request, res:Response, next:NextFunction)=>{
    picture_controller.post(req,res,next)
});

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    picture_controller.del(req,res,next)
});

export default router;