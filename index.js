import express from "express";
import { connectDB } from "./config/DB.js";
import routerStudents from "./routes/students.routes.js";
import routerNotification from "./routes/notifications.routes.js";



const app = express();
connectDB()

app.use(express.json())
app.use('/api', routerStudents)
app.use('/api', routerNotification)



app.listen(3000, () =>{
    console.log('server running 3000'); 
})