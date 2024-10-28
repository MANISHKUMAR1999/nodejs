const express = require("express");
const mongoose = require("mongoose");
const app = express();

async function connectDb() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myFirstDataBase");
    console.log("DB connected Successfully");
  } catch (error) {}
}
// created user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type:String,
   unique: true,
   required: 'Email address is required'
  },
  password: String,
});

const User = new mongoose.model("User", userSchema);

 async function createUser() {
  try{
    let newUser = await User.create({
      name: "Manish",
      email: "Manish@gmail.com",
      password: "Manish@345",
    });
    console.log(newUser)
  }
catch(error){
  console.log(error.code)
}
//Both two are useed for creatiing usser
  // let newUser = new User({
  //   name: "Manish 4",
  //   email: "Manish@gmail.com 4",
  //   password: "Manish@345 4",
  // });
  // await newUser.save()
  // console.log(newUser)
  // const user = await User.findById('671f61c983735cd8be0bf849')
 // const user = await User.find({})
  // const user = await User.findOne({name:'Manish 2'})
 // const user = await User.findByIdAndDelete('671f61c983735cd8be0bf849')
  //const user = await User.findByIdAndUpdate('671f61fb269c38a6a97fe076',{name:'Manish Updated'},{new:true})
  //console.log(newUser)
}

app.listen(3000, () => {
  console.log("server started");
  connectDb();
  createUser()
});
