const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const User = require("../models/userSchema");
const { verifyJWT, decodedJWT } = require("../utils/generateToken");
const {uploadImageToCloudinary,deleteImagefromCloudinary}= require("../utils/uploadImage");
const fs = require('fs')
const uniqid  = require('uniqid')
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });

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
    const image=req.file
    console.log(image)
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

// cloudinary code
  const {secure_url,public_id} = await uploadImageToCloudinary(image.path) // secure_url,public_id
fs.unlinkSync(image.path) // deleting the image from the folder
//const blogId = title.toLowerCase().replaceAll(" ")
//const blogId = title.toLowerCase().replace(/ +/g, '-')
const blogId = title.toLowerCase().split(" ").join("-") + "-" + randomUUID();
    const blog = await Blog.create({
         title,description,draft,creator,image:secure_url,imageId:public_id,blogId
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
      }).populate({
        path: "likes",
        select: "email name",
      });
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
        const {blogId} = req.params
        const blog = await Blog.findOne({blogId}).populate({
          path:'comments',
          populate:{
            path:'user',
            select:'-password'
          }
        }).populate({
          path:'creator',
          select:"name email"
        })
       
        return res.status(200).json({"success":"true","message":"blog fetched successfully",blog})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
}

async function updateBlog(req,res){
    try{
     const creator = req.user
     console.log(creator,"hello")
     const {id} = req.params
     const {title,description,draft} = req.body
     console.log("draft",draft);

     const user = await User.findById(creator).select("-password")
     console.log("user from update blog",user)
     //console.log(user.blogs.find(blogId=> blogId===id))
    const blog = await Blog.findById(id)
    if (!blog) {
        return res.status(500).json({
          message: "Blog is not found",
        });
      }
    console.log("blog",blog)

     if(!(creator == blog.creator)){
        return res.status(500).json({"error":error.message,"message":"You are not authorised for this action"})
     }
     blog.title = title || blog.title
     blog.description = description || blog.description
     blog.draft = draft || blog.draft

     //const updatedBlog = await Blog.updateOne({_id:id},{title,description,draft},{new:true})

        // const blog = await Blog.findByIdAndUpdate(blogId,{title,description,draft})
        return res.status(200).json({"success":true,"message":"Blog Updated Successfully",blog})

    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
    
}

async function deleteBlog(req,res){

    try{
        const creator = req.user;
        const {id} = req.params;
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(500).json({
              message: "Blog is not found",
            });
          }
      
          if (creator != blog.creator) {
            return res.status(500).json({
              message: "You are not authorized for this action",
            });
          }
          await deleteImagefromCloudinary(blog.imageId)
           await Blog.findByIdAndDelete(id);

        await User.findByIdAndUpdate(creator,{$pull:{blogs:id}})
        return res.status(200).json({"success":true,"message":"Blog Deleted Successfully"})
    }
    catch(error){
        return res.status(500).json({"error":error.message,"message":"Delete blog failed"})
    }

}


async function likeBlog(req,res){

    try{
        const creator = req.user;
        const {id} = req.params;
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(500).json({
              message: "Blog is not found",
            });
          }
          console.log(blog)
          console.log(creator)
      
         if(!blog.likes.includes(creator)){
            await Blog.findByIdAndUpdate(id,{$push:{likes:creator}})
            return res.status(200).json({"success":true,"message":"Blog Likes Successfully"})
         }
         else{
            await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } });
            return res.status(200).json({"success":true,"message":"Blog disLikes Successfully"})

         }
      //  return res.status(200).json({"success":true,"message":"Blog Deleted Successfully"})
    }
    catch(error){
        return res.status(500).json({"error":error.message,"message":"Delete blog failed"})
    }

}


async function addComment(req,res){

  try{
      const creator = req.user;
      const {id} = req.params;
      const {comment} = req.body
      console.log("req body",comment)

      if(!comment){
        return res.status(500).json({
          message: "please enter the comment",
        });
      }
      const blog = await Blog.findById(id)
      if (!blog) {
          return res.status(500).json({
            message: "Blog is not found",
          });
        }
        
   // creating the comment
        const newComment = await Comment.create({comment,blog:id,user:creator});
        console.log("new commment",newComment)

        // adding the comment 
      await Blog.findByIdAndUpdate(id,{$push:{comments:newComment._id}})
      

     return res.status(200).json({"success":true,"message":"Comment added Successfully"})
  }
  catch(error){
      return res.status(500).json({"error":error.message})
  }

}


async function deleteComment(req,res){

  try{
    
      const userId = req.user;
      const {id} = req.params;
      console.log(id)
    
      

      const comment = await Comment.findById(id).populate({path:'blog',select:'creator'})
      console.log(comment,"comment",comment.user !== userId,comment.blog.creator,comment.user)
      if (!comment) {
          return res.status(500).json({
            message: "comment is not found",
          });
        }
      //  console.log(userId,)
   // check the comment user id
   if (comment.user != userId && comment.blog.creator != userId) {
    return res.status(500).json({
      message: "You are not authorized",
    });
  }
      await Blog.findByIdAndUpdate(comment.blog_.id,{$pull:{comments:id}})
      await Comment.findByIdAndDelete(id)

     return res.status(200).json({"success":true,"message":"Comment deleted Successfully"})
  }
  catch(error){
      return res.status(500).json({"error":error.message})
  }

}

module.exports = {createBlog,getAllBlog,getBlogById,updateBlog,deleteBlog,likeBlog,addComment,deleteComment}