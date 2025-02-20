import express from 'express';
import { newnotification } from '../controllers/notifications.controller.js';



const router = express.Router()

router.post('/createNotification', newnotification)




export default router