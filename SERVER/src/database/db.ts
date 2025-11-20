import {DataSource} from "typeorm";

export const DbContex = new DataSource({
    type:"sqlite",
    database:"db.sqlite",
    synchronize:true,
    logging:true,
    entities:{}
})