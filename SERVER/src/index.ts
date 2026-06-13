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


app.use("/static",Express.static(__dirname + "/static"))

// 2. Middleware (обработка JSON и статики)
app.use(cookieParser());
app.use(Express.json());
app.use(cors(
  {
      origin:'http://localhost:5173',
      optionsSuccessStatus:200,
      maxAge:600,
      credentials:true
  }))
app.use(router);
const frontEndProto = process.env.FRONT_PROTO || "http"
const frontEndHost = process.env.FRONT_HOST || "localhost"
const frontEndPort = process.env.FRONT_PORT || 5173

// 3. Маршруты (Routes)
app.get('/', (req, res) => { //роутер
  res.send('Hello World!');//контроллер
});

DbContext.initialize().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

});