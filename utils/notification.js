import cron from "node-cron";
import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import Notification from "../models/notifications.model.js";
import Student from "../models/students.model.js";

configDotenv()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const email = process.env.EMAIL
const pass = process.env.PASS

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: pass
    }
})


// tener en cuenta que al subirlo a AWS la zona horaria va a cambiar 

cron.schedule("39 16 * * *", async () => {
    try {
        console.log("Enviando notificaciones automáticas...");
        const students = await Student.find({ "paymentsPending.0": { $exists: true } }); 
        for (const student of students) {
            for (const pending of student.paymentsPending) {
                let message = "";
                let subject = "";
                if (pending.type === "request") {
                    subject = " Revisión de Documentos de Matrícula";
                    message = `
                        <p>Hola <b>${student.name}</b>,</p>
                        <p>Por favor revisa tus documentos para completar el proceso de matrícula.</p>
                        <p>Atentamente,Tu institución</p>
                    `;
                }
                else if (pending.type === "payment") {
                    subject = "Recordatorio de Pago Pendiente";
                    message = `
                        <p>Hola <b>${student.name}</b>,</p>
                        <p>Tienes un pago pendiente para completar la matricula. Recuerda que debes realizar el pago antes de empezar el perdiodo escolar</b>.</p>
                        <p>Por favor, revisa tu cuenta para realizar el pago.</p>
                        <p>Atentamente,Tu institución</p>
                    `;
                }
                if (message) {
                    const notification = new Notification({
                        studentId: student._id,
                        message: message.replace(/<\/?[^>]+(>|$)/g, ""),
                    });
                    await notification.save();
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: student.email,
                        subject: subject,
                        html: message
                    });
                    console.log(` Notificación y correo enviado a ${student.email}`);
                }
            }
        }
    } catch (error) {
        console.error("Error al enviar notificaciones:", error.message);
    }
})
export default cron;