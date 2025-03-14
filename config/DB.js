import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function connectDB() {
    const link = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.LINK_DB}/Notificaciones?retryWrites=true&w=majority`
    try {
        await mongoose.connect(link)
        console.log('conectado a la base de datos');
    } catch (error) {
        console.log('no se pudo conectar a la base de datos');
        console.log(error);
    }
}
