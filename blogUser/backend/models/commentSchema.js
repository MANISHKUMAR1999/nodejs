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
        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],

        // Nested Comment Code
        replies:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ],
        parentComment:{
            
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment",
                default:null
            
        }
    
}, { timestamps: true })

const Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment