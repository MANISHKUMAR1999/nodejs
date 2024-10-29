const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())

async function dbConnect(){
    try{
await mongoose.connect('mongodb://localhost:27017/blogDataBase')
console.log("DB connected Successfully")
    }
    catch(error){
console.log(error)
    }
}


const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:'Email is required'
    },
    password:String

})

const User = new mongoose.model("User",userSchema)


let users=[]
app.post('/users',async(req,res)=>{
    const {name,email,password} = req.body
try{
  if(!name ){
    return res.status(400).json({"message":"please fill the name","success":"false"})
  }
  if(!email){
    return res.status(400).json({"message":"please fill the email","success":"false"})
  }
  if(!password){
    return res.status(400).json({"message":"please fill the password","success":"false"})
  }
  //users.push({...req.body,id:users.length+1})

const checkForExistingUser = await User.findOne({email})
if(checkForExistingUser){
    return res.status(400).json({"sucess":"false","message":"Already registered with the email","error":"Email is already present"})
}
  const newUser = await User.create({
    name:name,
    email:email,
    password:password
  })
  return res.status(200).json({"sucess":"true","message":"user created successfully",newUser})
}
catch(err){
    return res.status(500).json({"sucess":"false","message":"please try again","error":err.message})
}
})


app.get('/users',async(req,res)=>{
    try{
// db calls

const users = await User.find({})
return res.status(200).json({"sucess":"true","message":"user fetched successfully",users})
    }
    catch(error){
        return res.status(500).json({"sucess":"false","message":"please try again"})

    }
})


app.get('/users/:id',async(req,res)=>{
    try{
// db calls
//const user = users.filter((user)=>user.id == req.params.id)
const id = req.params.id
console.log(id)
//const user = {}
const user  = await User.findById(id)
//const user  = await User.findOne({name:'mANIHS'}) // TAKE AS a parameter

console.log(user)

if(!user){
    return res.status(404).json({"sucess":"false","message":"user not found",user})
}
return res.status(200).json({"sucess":"true","message":"user fetched successfully",user})
    }
    catch(error){
        return res.status(500).json({"sucess":"false","message":"please try again"})

    }
})

app.patch('/users/:id',async(req,res)=>{
    try{

   
    const id = req.params.id;
    const {name,password,email} = req.body
    console.log(id)
    const updatedUsers = await User.findByIdAndUpdate(id,{name,password,email},{new:true})
    console.log(updatedUsers)
    // const index = blogs.findIndex((blog)=>blog.id == id)
    // blogs[index] = {...blogs[index],...req.body}
    //console.log(blogs)
    //const updatedUsers = users.map((blog,index)=>blog.id == id ? ({...users[index],...req.body}): blog)
    //users = [...updatedUsers]
    if(!updatedUsers){
        return res.status(404).json({"sucess":"false","message":"user not found",updatedUsers})
    }
    return res.json({"message":"users updated successfully",updatedUsers})
}
catch(error){
    return res.status(500).json({"sucess":"false","message":"please try again"})
}
    
})

app.delete('/users/:id',async(req,res)=>{

    try{
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id)
         //users = [...updatedUsers]
    if(!deletedUser){
        return res.status(404).json({"sucess":"false","message":"user not found",deletedUser})
    }
    return res.json({"message":"users deleted successfully",deletedUser})
}

    
    catch(error){
        return res.status(500).json({"sucess":"false","message":"please try again"})
    }

})


app.listen(3000,()=>{
console.log("server started")
dbConnect()
})