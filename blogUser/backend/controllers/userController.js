const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const { generateJWT, verifyJWT } = require('../utils/generateToken')
const { verify } = require('jsonwebtoken')
const  transporter  = require('../utils/transporter')


async function createUser(req,res){
  
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
  if (checkForExistingUser.verify) {
    return res.status(400).json({
      success: false,
      message: "User already registered with this email",
    });
  } else {
    let verificationToken = await generateJWT({
      email: checkForExistingUser.email,
      id: checkForExistingUser._id,
    });
  
    //email logic
  
    const sendingEmail = transporter.sendMail({
      from: "", // email from
      to: checkForExistingUser.email,
      subject: "Email Verification",
      text: "Please verify your email",
      html: `<h1>Click on the link to verify your email</h1>
          <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
    });
  
    return res.status(200).json({
      success: true,
      message: "Please Check Your Email to verify your account",
    });
  }
  //  return res.status(400).json({"sucess":"false","message":"Already registered with the email","error":"Email is already present"})
}



const hasedPassword = await bcrypt.hash(password,10)
console.log(hasedPassword)

  const newUser = await User.create({
    name:name,
    email:email,
    password:hasedPassword
  })
  const verificationToken = await generateJWT({
    "email":newUser.email,
    "id":newUser._id
  })

  // email logic
  const sendingEmail = transporter.sendMail({
    from:'', // from email
    to:email,
    subject:'Email Verification',
    text:'Please verify your Email',
    html:`<h1>Click on the link to verify your email</h1>
    <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>
    `


  })



  return res.status(200).json({"sucess":"true","message":"Please check your Email to Verify your account"
   
  })
}
catch(err){
    return res.status(500).json({"sucess":"false","message":"please try again","error":err.message})
}
}

async function verifyToken(req,res){
  try{
    
    const {verificationToken} = req.params;
    
    const verifyToken = await verifyJWT(verificationToken)
   if(!verifyToken){
    return res.status(400).json({
      success:false,
      message:"Invalid Token/Email expired."
    })
   }
   const {id} = verifyToken
   const user = await User.findByIdAndUpdate(id,{verify:true},{new:true})

   if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not exist",
    });
  }


  return res.status(200).json({
    success:true,
    message:"Email verified successfully"
  })

  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Please try again",
      error:error.message
    })

  }
}

async function login(req,res) {
  const {name,email,password} = req.body
  try{
   
    if(!email){
      return res.status(400).json({"message":"please fill the email","success":"false"})
    }
    if(!password){
      return res.status(400).json({"message":"please fill the password","success":"false"})
    }
    //users.push({...req.body,id:users.length+1})
  
  const checkForExistingUser = await User.findOne({email})
  if(!checkForExistingUser){
    let verificationToken = await generateJWT({
      email: checkForExistingUser.email,
      id: checkForExistingUser._id,
    });
  
    //email logic
  
    const sendingEmail = transporter.sendMail({
      from: "",
      to: checkForExistingUser.email,
      subject: "Email Verification",
      text: "Please verify your email",
      html: `<h1>Click on the link to verify your email</h1>
          <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
    });
  
    return res.status(200).json({
      success: true,
      message: "Please Check Your Email to verify your account",
    });
      return res.status(400).json({"sucess":"false","message":"User not exist"})
  }

   if (!(checkForExistingUser.verify)) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email",
    });
    }

  const checkForPassword = await bcrypt.compare(password,checkForExistingUser.password)
  if(!checkForPassword){
    return res.status(400).json({"sucess":"false","message":"In Correct Password"})
  }
//   if(!(checkForExistingUser.password == password)){
//     return res.status(400).json({"sucess":"false","message":"In Correct Password"})
// }
let token = await generateJWT({
  email: checkForExistingUser.email,
  id: checkForExistingUser._id,
});


  

  
  
    return res.status(200).json({"sucess":"true","message":"logged in successfully","user":{name:checkForExistingUser.name,email:checkForExistingUser.email,id:checkForExistingUser._id,token:token}})
  }
  catch(err){
      return res.status(500).json({"sucess":"false","message":"please try again","error":err.message})
  }
}

async function getAllUser(req,res){
  try{
// db calls

const users = await User.find({})
return res.status(200).json({"sucess":"true","message":"user fetched successfully",users})
  }
  catch(error){
      return res.status(500).json({"sucess":"false","message":"please try again","error":error.message})

  }
}

async function getUserById(req,res){
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
}

async function updateUser(req,res){
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
  
}

async function deleteUser(req,res){

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

}



module.exports = {createUser, getAllUser,getUserById,updateUser,deleteUser,login,verifyToken}