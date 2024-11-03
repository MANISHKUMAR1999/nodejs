

const express = require('express');
const multer = require('multer')
//const upload = multer({ dest: './uploads/' })
const path = require('path')

const app = express();
app.use(express.json()) // middle to get data json
//app.use(express.urlencoded({extended:true})) // middleware to get data from form-encoded ->east way

const storage = multer.diskStorage({

    // 1. destination 2 .filename
    destination:"uploadss",
    filename:function(req,file,cb){
        //console.log(file.originalname.split('.')[1])
        console.log(path.extname(file.originalname))
 // cb(null,file.originalname)
  cb(null,Date.now()+path.extname(file.originalname))
    }

})
const upload = multer({
    storage,
    limits:{
        fileSize:1000000
    }
}).single('image')

app.post('/imageupload',(req,res)=>{
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(400).json({"message":err.message})
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(400).json({"message":err.message})
        }
        if(!req.file){
            return res.status(400).json({"message":"please upload file"})
                }
        // Everything went fine.
        return res.status(200).json({"message":"file uploaded suceesffully"})
      })
  
   
    console.log(req.body)
    console.log(req.file)
    console.log(req.files)
})

app.listen(3333,()=>{
    console.log("server started successfully")
})