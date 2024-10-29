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
}

module.exports = createUser