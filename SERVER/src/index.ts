// 1. Импорт библиотек
import DbContext from "../src/database/db";
import router from "./routers/index_router";
import  Express from "express";
import ENV from "dotenv"

ENV.config({path: __dirname + "/../.env"})

const app = Express();
const PORT = process.env.PORT || 3000;



// 2. Middleware (обработка JSON и статики)
app.use(Express.json());
app.use(router)

// 3. Маршруты (Routes)
app.get('/', (req, res) => { //роутер
  res.send('Hello World!');//контроллер
});

DbContext.initialize().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

});