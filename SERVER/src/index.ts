// 1. Импорт библиотек
import DbContext from "../src/database/db";
import router from "./routers/index_router";
import  Express from "express";
import ENV from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

ENV.config({path: __dirname + "/../.env"})

const app = Express();
const PORT = process.env.PORT || 3000;



// 2. Middleware (обработка JSON и статики)
app.use(cookieParser());
app.use(Express.json());
app.use(router);
const frontEndProto = process.env.FRONT_PROTO || "http"
const frontEndHost = process.env.FRONT_HOST || "localhost"
const frontEndPort = process.env.FRONT_PORT || 45000
app.use(cors(
  {
      origin:`${frontEndProto}://${frontEndHost}:${frontEndPort}`, 
      credentials: true
  }))

// 3. Маршруты (Routes)
app.get('/', (req, res) => { //роутер
  res.send('Hello World!');//контроллер
});

DbContext.initialize().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

});