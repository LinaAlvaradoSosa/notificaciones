import mongoose, { Types } from "mongoose";


const notificationScherma = new mongoose.Schema({
type: {
    type: String,
    emun: ['request','payment']
}, 
message: {
    type: String,
    required: true
},
createAt:{
    type: Date,
    default: Date.now
},
students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", 
    required: true
}]
}, { versionKey: false }
)

const notification = mongoose.model('Notification', notificationScherma);
export default notification