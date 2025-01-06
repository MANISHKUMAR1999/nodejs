const User = require('../models/userSchema')
const bcrypt = require('bcrypt')

const { generateJWT, verifyJWT } = require('../utils/generateToken')
const { verify } = require('jsonwebtoken')
const  transporter  = require('../utils/transporter')
const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth")
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 5 });


admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSAL_DOMAIN,
  }
  )
});

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
  if (checkForExistingUser.googleAuth) {
    return res.status(400).json({
      success: true,
      message:
        "This email already registered with google. please try through continue with google",
    });
  }
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
      from: process.env.EMAIL_USER, // email from
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

const username = email.split('@')[0] + randomUUID()



console.log(hasedPassword)
console.log(username,"user name")

  const newUser = await User.create({
    name:name,
    email:email,
    password:hasedPassword,
    username
   
  })
  const verificationToken = await generateJWT({
    "email":newUser.email,
    "id":newUser._id
  })

  // email logic
  const sendingEmail = transporter.sendMail({
    from:process.env.EMAIL_USER, // from email
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

async function verifyEmail(req,res){
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

  if (!checkForExistingUser) {
    return res.status(400).json({
      success: false,
      message: "User not exist",
    });
  }

  if (checkForExistingUser.googleAuth) {
    return res.status(400).json({
      success: true,
      message:
        "This email already registered with google. please try through continue with google",
    });
  }

  let checkForPass = await bcrypt.compare(
    password,
    checkForExistingUser.password
  );

  if (!checkForPass) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  }
 
  if (!checkForExistingUser.verify) {
    // send verification email
    let verificationToken = await generateJWT({
      email: checkForExistingUser.email,
      id: checkForExistingUser._id,
    });

    //email logic

    const sendingEmail = transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: checkForExistingUser.email,
      subject: "Email Verification",
      text: "Please verify your email",
      html: `<h1>Click on the link to verify your email</h1>
      <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
    });

    return res.status(400).json({
      success: false,
      message: "Please verify you email",
    });
  }
  

  // if(!checkForExistingUser){
  //   let verificationToken = await generateJWT({
  //     email: checkForExistingUser.email,
  //     id: checkForExistingUser._id,
  //   });


  //   if (checkForExistingUser.googleAuth) {
  //     return res.status(400).json({
  //       success: true,
  //       message:
  //         "This email already registered with google. please try through continue with google",
  //     });
  //   }

  //   const checkForPassword = await bcrypt.compare(password,checkForExistingUser.password)
  //   if(!checkForPassword){
  //     return res.status(400).json({"sucess":"false","message":"In Correct Password"})
  //   }

  //   if (!(checkForExistingUser.verify)) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Please verify your email",
  //   });
  //   }
  
  
  //   //email logic
  
  //   const sendingEmail = transporter.sendMail({
  //     from: "",
  //     to: checkForExistingUser.email,
  //     subject: "Email Verification",
  //     text: "Please verify your email",
  //     html: `<h1>Click on the link to verify your email</h1>
  //         <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
  //   });
  
  //   return res.status(200).json({
  //     success: true,
  //     message: "Please Check Your Email to verify your account",
  //   });
  //     return res.status(400).json({"sucess":"false","message":"User not exist"})
  // }

  


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

async function followUser(req,res){
  try {
    const followerId = req.user;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({
        message: "User is not found",
      });
    }

    console.log("hello user")

    if (!user.followers.includes(followerId)) {
      await User.findByIdAndUpdate(id, { $set: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $set: { following: id } });
      return res.status(200).json({
        success: true,
        message: "Follow",
       
      });
    } else {
      await User.findByIdAndUpdate(id, { $unset: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $unset: { following: id } });
      return res.status(200).json({
        success: true,
        message: "Unfollow",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}



async function googleAuth(req, res) {
  try {
    const { accessToken } = req.body;

    const response = await getAuth().verifyIdToken(accessToken);
    console.log(response)

     const { name, email } = response;

    let user = await User.findOne({ email });

    if (user) {
      // already registered
      if (user.googleAuth) {
        let token = await generateJWT({
          email: user.email,
          id: user._id,
        });

        return res.status(200).json({
          success: true,
          message: "logged in successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token,
          },
        });
      } else {
        return res.status(400).json({
          success: true,
          message:
            "This email already registered without google. please try through login form",
        });
      }
    }

    let newUser = await User.create({
      name,
      email,
      googleAuth: true,
      verify: true,
    });

    let token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Registration in successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
   // console.log(error)
    return res.status(500).json({
      success: false,
      message: "Please try again with google",
      error: error.message,
    });
  }
}



module.exports = {createUser, getAllUser,getUserById,updateUser,deleteUser,login,verifyEmail,googleAuth,followUser}