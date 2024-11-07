
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


async function dbConnect(){
    try{
await mongoose.connect(process.env.DB_URL)
console.log("DB connected Successfully")
    }
    catch(error){
console.log(error)
    }
}

module.exports = dbConnect