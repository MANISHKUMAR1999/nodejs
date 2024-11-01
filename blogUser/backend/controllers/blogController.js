const Blog = require("../models/blogSchema")
const User = require("../models/userSchema");
const { verifyJWT, decodedJWT } = require("../utils/generateToken");

async function createBlog(req,res){
   // console.log(await decodedJWT(req.body.token))
//     let isValid = await verifyJWT(req.body.token);
//     console.log("isvalid",isValid)
    
//   if(!isValid){
//     return res.status(200).json({"message":"InValid token","success":"false"})
//   }
  // added the creatorfrom user object
  const creator = req.user;
    const {title,description,draft} = req.body
    console.log(req.body)
   try{
    //console.log(req.body)
   
  
    //console.log(description)
    if(!title){
        return res.status(400).json({"message":"please fill title field"})
    }
    if(!description){
        return res.status(400).json({"message":"please fill description field"})
    }

    const findUser = await User.findById(creator)

console.log(findUser)
if(!findUser){
    return res.status(500).json({"message":"not authorised user"})
}
    const blog = await Blog.create({
         title,description,draft,creator
       })

       await User.findByIdAndUpdate(creator,{$push:{blogs:blog._id}})

    return res.status(200).json({"success":true,"message":"blog created successfully",blog})
   }
   catch(error){
    
  return res.status(500).json({"error":error.message})
   }
}
async function getAllBlog(req,res){
    try{
        const {id} = req.params
      //  const allBlogs = await Blog.find({draft:true}).populate("creator")
      const allBlogs = await Blog.find({draft:false}).populate({
        path:"creator",
       // select:"name"
       select:"-password"  // remove password field from creator object
      })
      console.log("all blogs",allBlogs)
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