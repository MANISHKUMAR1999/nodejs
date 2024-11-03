const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    blog: // comment on which blog
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Blog"
        },
        user:{ // which user is adding the comment
            type:mongoose.Schema.Types.ObjectId, //connecting the comment model to user model
            ref:"User",
            required:true
        }, 
    
})

const Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment