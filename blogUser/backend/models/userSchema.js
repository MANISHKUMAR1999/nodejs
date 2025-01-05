const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        unique:true,
        required:'Email is required'
    },
    username:{
        type:String,
       
    },
    password:{
        type:String,
        required:true

    },
    blogs:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    }
],
verify:{
    type:Boolean,
    default:false
},
googleAuth: {
    type : Boolean,
    default: false,
  },
  profilePic: {
    type: String,
    default: null,
  },
  bio:{
    type:String,
  },
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  saveBlogs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Blog"
  }],
  likeBlogs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Blog"
  }],
  showlikeBlogs:{
    type:Boolean,
    default:true
  }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

module.exports = User