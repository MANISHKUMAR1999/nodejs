const { verifyJWT } = require("../utils/generateToken")


const verifyUser = async(req,res,next)=>{
    //let token  = req.headers.authorization.split(" ")[1]
//     let token  = req.headers.authorization.replace("Bearer ","")
//     if(!token){
//         return res.status(400).json({
//             "success":false,
//             "message":"Please sign in"
//         })
//     }
//     try{
//         console.log(token,"token from auth")
//  let user = await verifyJWT(token);
//  if(!user){
//     return res.status(400).json({
//         "success":false,
//         "message":"Please sign in"
//     })
//  }
//  console.log("user form auth",user)
//  req.user = user.id
//  next()
//  console.log("everything is ok",user)
//     }
//     catch(error){

//     }
//     console.log(req.headers.authorization)
// console.log("verify User")
//next()
try {
    let token = req.headers.authorization.split(" ")[1];
    // let token = req.headers.authorization.replace("Bearer ","")

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Please sign in",
        });
    }

    try {
        let user = await verifyJWT(token);
        console.log(user)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please sign in",
            });
        }
        req.user = user.id;
        next();
    } catch (err) {}
} catch (err) {
    return res.status(400).json({
        success: false,
        message: "Tokken missing",
    });
}
}

module.exports=verifyUser