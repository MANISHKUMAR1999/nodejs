const Blog = require("../models/blogSchema")

async function createBlog(req,res){
    const {title,description,draft} = req.body
   try{
    console.log(req.body)
   
  
    console.log(description)
    if(!title){
        return res.status(400).json({"message":"please fill title field"})
    }
    if(!description){
        return res.status(400).json({"message":"please fill description field"})
    }
    const blog = await Blog.create({
        title,description,draft
      })

    return res.status(200).json({"success":true,blog})
   }
   catch(error){
    
  return res.status(500).json({"error":error.message})
   }
}
async function getAllBlog(req,res){
    try{
        const {id} = req.params
        const allBlogs = await Blog.find({draft:true})
        if(allBlogs.length == 0){
            return res.status(200).json({"success":"true","message":"No Blogs found"})
        }
        return res.status(200).json({"success":"true","message":"All Blogs",allBlogs})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
}

async function getBlogById(req,res){
    try{
        const {id} = req.params
        const blog = await Blog.findById(id)
       
        return res.status(200).json({"success":"true","message":"blog fetched successfully",blog})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
}

async function updateBlog(req,res){
    
}

async function deleteBlog(req,res){

}

module.exports = {createBlog,getAllBlog,getBlogById,updateBlog,deleteBlog}