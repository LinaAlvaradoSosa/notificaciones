import Notification from '../models/notifications.model.js';




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

