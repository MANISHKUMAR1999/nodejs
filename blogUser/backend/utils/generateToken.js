
const jwt = require('jsonwebtoken')
async function generateJWT(payload){
const token = await jwt.sign(payload,"jwtbhutkhatarnak",{expiresIn:"1hr"})
return token
}

async function verifyJWT(token){
    try{
        const isValid = await jwt.verify(token,"jwtbhutkhatarnak")
        return true
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