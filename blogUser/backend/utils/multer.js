
const multer = require('multer')
const path = require('path')

// const storage = multer.diskStorage({
//     destination:"uploads",
//      filename:function(req,file,cb){
//         console.log(file)
//         //console.log(file.originalname.split('.')[1])
//        // console.log(path.extname(file.originalname))
//  // cb(null,file.originalname)
//   cb(null,Date.now()+path.extname(file.originalname))
//     }
// })
const storage = multer.memoryStorage()
const upload = multer({
    storage
})
module.exports = upload