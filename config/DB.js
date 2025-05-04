import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function connectDB() {
    const link = process.env.LINK_DB
    try {
        await mongoose.connect(link)
        console.log('conectado a la base de datos');
    } catch (error) {
        console.log('no se pudo conectar a la base de datos');
        console.log(error);
    }
}
