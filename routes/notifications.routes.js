import express from 'express';
import { newnotification, sendNotification } from '../controllers/notifications.controller.js';



const router = express.Router()

router.post('/createNotification', newnotification)
router.post('/send-notification', sendNotification)




export default router