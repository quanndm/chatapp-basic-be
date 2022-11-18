const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    topic:{
        type: String,
    },
    recipients:[{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
},
{ timestamps: true }
)
module.exports = mongoose.model("Conversation", conversationSchema)