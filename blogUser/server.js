const express = require('express')

const app = express();

app.use(express.json());
let users=[]
app.post('/users',(req,res)=>{
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
  users.push({...req.body,id:users.length+1})
  return res.status(200).json({"sucess":"true","message":"user created successfully"})
}
catch(err){
    return res.status(500).json({"sucess":"false","message":"please try again"})
}
})


app.get('/users',(req,res)=>{
    try{
// db calls
return res.status(200).json({"sucess":"true","message":"user fetched successfully",users})
    }
    catch(error){
        return res.status(500).json({"sucess":"false","message":"please try again"})

    }
})


app.get('/users/:id',(req,res)=>{
    try{
// db calls
const user = users.filter((user)=>user.id == req.params.id)

if(user.length){
    return res.status(200).json({"sucess":"false","message":"user not found",user})
}
return res.status(200).json({"sucess":"true","message":"user fetched successfully",user})
    }
    catch(error){
        return res.status(500).json({"sucess":"false","message":"please try again"})

    }
})

app.patch('/users/:id',(req,res)=>{
    const {id} = req.params;
    console.log(id)
    // const index = blogs.findIndex((blog)=>blog.id == id)
    // blogs[index] = {...blogs[index],...req.body}
    //console.log(blogs)
    const updatedUsers = users.map((blog,index)=>blog.id == id ? ({...users[index],...req.body}): blog)
    users = [...updatedUsers]
    return res.json({"message":"users updated successfully",updatedUsers})
    
})


app.listen(3000,()=>{
console.log("server started")
})