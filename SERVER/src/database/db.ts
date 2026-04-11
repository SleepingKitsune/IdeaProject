import {DataSource} from "typeorm";
import { Category } from "../entityes/Category";
import { Idea } from "../entityes/Idea";
import { Picture } from "../entityes/Picture";
import { User } from "../entityes/User";
import { Like } from "../entityes/Like";

const DbContext = new DataSource({
    type:"sqlite",
    database:"db.sqlite",
    synchronize:true,
    logging:true,
    entities:{Category, Idea, Picture, User, Like}
})

export default DbContext