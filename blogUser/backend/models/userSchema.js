const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:'Email is required'
    },
    password:String,
    blogs:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    }
],
verify:{
    type:Boolean,
    default:false
}
})

const User = mongoose.model('User',userSchema)

module.exports = User