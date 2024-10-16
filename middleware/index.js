
const express = require('express');
const app = express();

const fs = require('fs')

app.use(express.json()) // next function is already handle by this code

//app.use(express.urlencoded({extended:true})) 
function fun(req,res,next){
    console.log("hello")
    next()

}

function logDetails(req,res,next){
    let data = Date.now()
    fs.appendFile(__dirname+"/logfile.txt",`${data}\n`,(err)=>{
next()
    })

}

app.use(fun)

app.get('/',(req,res)=>{
   return res.status(200).json({name:"value"})
})


app.post('/blogs',logDetails,(req,res)=>{
    try{
       // dsf
        return res.status(200).json({message:"post method"})
    }
   catch(err){
    console.log(err)
    next()
   }
   
 })
 
 app.use(( req, res, next) => {
    //console.error(err.stack)
    res.status(500).json({message:"not found"})
  })

 app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(3000,()=>{
    console.log("server starteed")
})