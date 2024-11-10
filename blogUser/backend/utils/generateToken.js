
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

async function generateJWT(payload){
const token = await jwt.sign(payload,process.env.JWT_API_SECRET)
return token
}

async function verifyJWT(token){
    try{
        const data = await jwt.verify(token,process.env.JWT_API_SECRET)
        console.log(data,"data")

        return data
    }
    catch(error){
return false
    }
   
    }

    async function decodedJWT(token) {
        let decoded = await jwt.decode(token)
        return decoded
    }


module.exports = {generateJWT,verifyJWT,decodedJWT}