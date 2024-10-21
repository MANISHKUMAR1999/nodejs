const express = require('express');
const app = express();

app.use(express.json())
let blogs = []

app.post('/blogs',(req,res)=>{
  blogs.push({...req.body, id: blogs.length+1})
return res.json({"message":"blog created successfully"})
})
app.get('/blogs',(req,res)=>{
    const filteredblogs = blogs.filter((blog)=>!blog.draft)
   // console.log(filteredblogs)
    return res.json({filteredblogs})
})
app.get('/blogs/:id',(req,res)=>{
    const {id} = req.params
    const searchIndividualBlog = blogs.filter((blog)=>blog.id == id)
    // console.log(filteredblogs)
     return res.json({searchIndividualBlog})
})
app.patch('/blogs/:id',(req,res)=>{
    const {id} = req.params;
    console.log(id)
    // const index = blogs.findIndex((blog)=>blog.id == id)
    // blogs[index] = {...blogs[index],...req.body}
    console.log(blogs)
    const updatedBlogs = blogs.map((blog,index)=>blog.id == id ? ({...blogs[index],...req.body}): blog)
    blogs = [...updatedBlogs]
    return res.json({"message":"blogs updated successfully",updatedBlogs})
    
})
app.delete('/blogs/:id',(req,res)=>{
    
})

app.listen(3000,()=>{
    console.log("server started")
})