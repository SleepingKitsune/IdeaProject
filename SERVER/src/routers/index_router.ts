import { Router } from "express";
import category_router from "./category_router"
import idea_router from "./idea_router"
import like_router from "./like_router"
import picture_router from "./picture_router"
import user_router from "./user_router"


const router = Router();

router.use("/category", category_router );
router.use("/idea", idea_router);
router.use("/like", like_router );
router.use("/picture", picture_router );
router.use("/user", user_router );

export default router;