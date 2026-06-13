import { NextFunction, Request, Response, Router } from "express";
import { user_controller } from "../controllers/user_controller";
import multer from "multer";
import { uploadImg } from "../middlewares/upload_middleware";

const upload = multer({storage:uploadImg("../static")})


const router = Router();

router.get("/getAuthInfo", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.getForAuthUser(req,res,next)
});

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.get(req,res,next)
});

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.getAll(req,res,next)
});

router.post("/registration", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.registration(req,res,next)
});

router.post("/auth", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.auth(req,res,next)
});

router.put("/updateEmail", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.updateEmail(req,res,next)
});
router.put("/updatePassword", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.updatePassword(req,res,next)
});
router.put("/updateAvatar", upload.single("ava"), (req:Request, res:Response, next:NextFunction)=>{
    user_controller.updateAvatar(req,res,next)
});
router.put("/updateUser", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.updateUser(req,res,next)
});

router.delete("/delete", (req:Request, res:Response, next:NextFunction)=>{
    user_controller.del(req,res,next)
});

export default router;

