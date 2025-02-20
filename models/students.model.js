import mongoose from "mongoose";


const studentScherma = new mongoose.Schema({
name: {
    type: String,
    required: true
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
        type:{
            type: String,
            enum: ["request", "payment", "none"],
            required: true
    }
},
], 
notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
}]
}, { versionKey: false }
)

const Student = mongoose.model('Student', studentScherma);
export default Student