

const express = require('express');
const mongoose = require('mongoose')
const app = express()



async function  connectDb() {
    try{
  await mongoose.connect("mongodb://127.0.0.1:27017/myFirstDataBase")
  console.log("DB connected Successfully")
    }
    catch(error){

    }
    
}







app.listen(3000,()=>{
    console.log("server started")
    connectDb();
})