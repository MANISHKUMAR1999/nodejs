

const express = require('express');

const app = express();


app.get('/',(req,res)=>{
res.send("hello blogs")
})
app.get('/blogs',(req,res)=>{
    res.send(req.headers)

})
app.post('/blogs',(req,res)=>{
    
})
app.put('/blogs/:id',(req,res)=>{
   // console.log(JSON.parse(req.headers.name))
//    console.log(req.headers)
//    console.log("res headers",JSON.parse(req.headers.name))
    res.send({"key":"value"})
    
})
app.delete('/blogs',(req,res)=>{
    
})




app.listen(4000,()=>{
    console.log("server started")
})