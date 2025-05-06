import Notification from '../models/notifications.model.js';
import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv';

configDotenv()


export async function newnotification(req, res) {
    const { message, type } = req.body;
    try {
        if(!message) return res.send('Message is required');
        if(type != 'request' && type  != 'payment' ) return res.send('Type can be request or payment');
        const notification = new Notification(req.body)
        await notification.save();
        const populate = await Notification.findById(notification._id).populate('students')
        res.status(201).json(populate)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: 'Error, please contact with the admin'})
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

export const sendNotification = async (req, res) => {
    const { name, email, paymentsPending, delayMinutes = 0 } = req.body;

    const allowedDelays = [0, 5, 10, 15];
    if (!allowedDelays.includes(delayMinutes)) {
        return res.status(400).json({
        message: "Solo se permiten delays de 0, 5, 10 o 15 minutos."
    });
    }

    let subject = "";
    let message = "";

    if (paymentsPending === "request") {
        subject = "Revisión de Documentos de Matrícula";
        message = `
            <p>Hola <b>${name}</b>,</p>
            <p>Por favor revisa tus documentos para completar el proceso de matrícula.</p>
            <p>Atentamente,<br>Tu institución</p>
    `;
    } else if (paymentsPending === "payment") {
        subject = "Recordatorio de Pago Pendiente";
        message = `
            <p>Hola <b>${name}</b>,</p>
            <p>Tienes un pago pendiente. Recuerda que debes realizarlo antes de comenzar el periodo escolar.</p>
            <p>Por favor, revisa tu cuenta para realizar el pago.</p>
            <p>Atentamente,<br>Tu institución</p>
    `;
    } else if (paymentsPending === "none") {
        subject = "Información General";
        message = `
            <p>Hola <b>${name}</b>,</p>
            <p>Actualmente no tienes acciones pendientes. Gracias por mantenerte al día.</p>
            <p>Atentamente,<br>Tu institución</p>
    `;
    } else {
        return res.status(400).json({ message: "Tipo de pendiente inválido." });
    }

    const sendEmail = async () => {
        try {
        const notification = new Notification({
            studentEmail: email,
            message: message.replace(/<\/?[^>]+(>|$)/g, "")
        });
        await notification.save();

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject,
            html: message
        });

        console.log(`Correo enviado a ${email} (${paymentsPending})`);
    } catch (error) {
        console.error(`Error al enviar a ${email}:`, error.message);
    }
    };

    if (delayMinutes > 0) {
        setTimeout(sendEmail, delayMinutes * 60 * 1000); // minutos → milisegundos
        res.status(200).json({ message: `Correo programado en ${delayMinutes} minutos.` });
    } else {
        await sendEmail();
        res.status(200).json({ message: "Correo enviado inmediatamente." });
    }
};