const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const UserConversation = require('../models/conversation')
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
const createMessage = async (req, res)=>{
    try {
        const { sender, recipient, content, media, topic } = req.body
        //find conversation by sender and recipient, if not found, create new, else update
        const newConversation = await Conversation.findOneAndUpdate({
            $or: [
                { recipients: [sender, recipient] },
                { recipients: [recipient, sender] },
            ]
        }, {
            recipients: [sender, recipient],
            topic: topic ? topic : ""
        }, { new: true, upsert: true })

        //
        const newMessage = new Message({
            conversation: newConversation._id,
            sender: sender,
            recipient: recipient,
            content: content,
            media: media
        })
        await newMessage.save()
        return res.status(201).json({ "message": "Create Success!" })
    } catch (error) {
        return res.status(500).json({msg: err.message})
    }
}   

module.exports = {
    
}