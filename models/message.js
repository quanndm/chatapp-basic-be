const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation: {
        type: mongoose.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sender : {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    recipient:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    media: {
        type: mongoose.Types.Array,
        default: []
    }
},{timestamps: true})
 
module.exports = mongoose.model("Message", messageSchema)