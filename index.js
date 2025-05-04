import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/DB.js";
import routerStudents from "./routes/students.routes.js";
import routerNotification from "./routes/notifications.routes.js";
import "./utils/email.job.js"
import cors from "cors"

configDotenv()
const app = express();
connectDB()

app.use(express.json())
app.use(cors())
app.use('/api', routerStudents)
app.use('/api', routerNotification)

console.log("Zona horaria del servidor:", Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log("Fecha y hora actual:", new Date().toString());

app.listen(3000, () =>{
    console.log('server running 3000'); 
})