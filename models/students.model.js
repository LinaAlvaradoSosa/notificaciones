import mongoose from "mongoose";
import { schedule } from "node-cron";


const studentScherma = new mongoose.Schema({
name: {
    type: String,
}, 
email: {
    type: String,
    required: true
}, 
status: {
    type: String,
    enum: ["active", "pending", "suspended"],
    default: "active"
},
paymentsPending:[ 
    {
        type: String,
        enum: ["request", "payment", "none"],
        required: true
    },
], 
schedule: {
    type: String
},
message: {
    type: String
},
notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
}]
}, { versionKey: false }
)

const Student = mongoose.model('Student', studentScherma);
export default Student