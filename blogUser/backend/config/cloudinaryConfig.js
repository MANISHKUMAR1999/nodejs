const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
dotenv.config()


async function cloudinaryConfig(){
    try{
        await cloudinary.config({ 
            cloud_name:process.env.CLOUD_NAME, 
            api_key:process.env.CLOUDINARY_API_KEY , 
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
          console.log("cloudinary connect successfull")
    }
   catch(error){
console.log("erorr while connecting to cloudinary config")
   }
}

module.exports = cloudinaryConfig