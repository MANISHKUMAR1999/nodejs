

const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
// app.get("/",(req,res)=>{
//     //res.send("hello")
//     res.sendFile(path.join(__dirname,"index.html"))
//     //res.json({"message":"Hello message"})

// })
// app.get("/about",(req,res)=>{
//     //res.send("hello")
//     res.sendFile(path.join(__dirname,"index.html"))
//     //res.json({"message":"Hello message"})

// })
// app.get("/contact",(req,res)=>{
//     //res.send("hello")
//     res.sendFile(path.join(__dirname,"index.html"))
//     //res.json({"message":"Hello message"})

// })



app.get(['/','/about','/contact'],(req,res)=>{
    let path = req.url.split('/')[1].toUpperCase()
    path = path == '' ? 'App running on home page' : path
    fs.readFile(__dirname + "/index.html",'utf-8',(err,data)=>{
        if(err){
            throw new Error("Not found anyhting")
        }
        else{
            data = data.replace("[path]",path == ''? 'code Thread' : path)
            res.end(data)
        }

    })

})

app.post("/",(req,res)=>{
    res.send("hello")
})



app.listen(3000,()=>{
    console.log("server started")
})