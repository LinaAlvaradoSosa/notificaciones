import cron from "node-cron";
import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import Notification from "../models/notifications.model.js";
import Student from "../models/students.model.js";

configDotenv();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

const scheduleEmails = async () =>{
    console.log("Empezando con la proramacion automatica");
    const students = await Student.find({"paymentsPending.0": { $exists: true}})
    
    students.forEach(student =>{
        if(!student.schedule) {
            console.log(`el estudiante ${student.name} no tiene un horario definido`);
            return
        }
    console.log(`programando cron para ${student.name} para ${student.schedule}`);
    
    cron.schedule(student.schedule, async () => {
        for (const pending of student.paymentsPending){
            let message = "";
            let subject = "";

            if (pending === "request") {
                subject = "Revisión de Documentos de Matrícula";
                message = `
                    <p>Hola <b>${student.name}</b>,</p>
                    <p>Por favor revisa tus documentos para completar el proceso de matrícula.</p>
                    <p>Atentamente,<br>Tu institución</p>
                `;
            } else if (pending === "payment") {
                subject = "Recordatorio de Pago Pendiente";
                message = `
                    <p>Hola <b>${student.name}</b>,</p>
                    <p>Tienes un pago pendiente. Recuerda que debes realizarlo antes de comenzar el periodo escolar.</p>
                    <p>Por favor, revisa tu cuenta para realizar el pago.</p>
                    <p>Atentamente,<br>Tu institución</p>
                `;
            } else if (pending === "none") {
                subject = "Información General";
                message = `
                    <p>Hola <b>${student.name}</b>,</p>
                    <p>Actualmente no tienes acciones pendientes. Gracias por mantenerte al día.</p>
                    <p>Atentamente,<br>Tu institución</p>
                `;
            }
            if (message) {
                try {
                    const notification = new Notification({
                        studentId: student._id,
                        message: message.replace(/<\/?[^>]+(>|$)/g, "")
                    });
                    await notification.save();
                    
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: student.email,
                        subject: subject,
                        html: message
                    });
                    console.log(`Correo enviado a ${student.email} (${pending})`);
                } catch (err) {
                    console.error(`Error al enviar a ${student.email}:`, err.message);
                }
            }
        }
    })
    })
};


scheduleEmails();
export default cron;