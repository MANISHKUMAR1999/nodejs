const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

async function addComment(req,res){

    try{
        const creator = req.user;
        const {id} = req.params; // blog id
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
          const newComment = await Comment.create({comment,blog:id,user:creator}).then((comment) => {
            return comment.populate({
              path: "user",
              select: "name email",
            });
          });;
          console.log("new commment",newComment)
  
          // adding the comment 
        await Blog.findByIdAndUpdate(id,{$push:{comments:newComment._id}})
        
  
       return res.status(200).json({"success":true,"message":"Comment added Successfully",newComment})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
  
  }
  
  
  async function deleteComment(req,res){
  
    try{
      
        const userId = req.user;
        const {id} = req.params; // comment id
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

  
async function editComment(req,res){

    try{
        const userId = req.user;
        const {id} = req.params; // comment ID
        const {updatecomment} = req.body
        
  
       const comment = await Comment.findById(id)
       if(!comment){
        return res.status(500).json({
            message: "Comment is not found",
          });
       }

       if(comment.user != userId){
    return res.status(400).json({"success":false,"message":"you are not authorised to perform this action of edit"})
       }
      console.log(comment,comment.user,userId,comment.user != userId)
     // creating the comment
       await Comment.findByIdAndUpdate(id,{comment:updatecomment})
        
  
       return res.status(200).json({"success":true,"message":"Comment updated Successfully"})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
  
  }

  async function likeComment(req,res){

    try{
        const userId = req.user;
        const {id} = req.params;
        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(500).json({
              message: "Comment is not found",
            });
          }
          console.log(comment)
          //console.log(creator)
      
         if(!comment.likes.includes(userId)){
            await Comment.findByIdAndUpdate(id,{$push:{likes:userId}})
            return res.status(200).json({"success":true,"message":"Comment Likes Successfully"})
         }
         else{
            await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
            return res.status(200).json({"success":true,"message":"Comment disLikes Successfully"})

         }
      //  return res.status(200).json({"success":true,"message":"Blog Deleted Successfully"})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }

}


async function addNestedComment(req, res) {
  try {
    const userId = req.user;

    const { id: blogId, parentCommentId } = req.params;

    const { reply } = req.body;

    const comment = await Comment.findById(parentCommentId);

    const blog = await Blog.findById(blogId);

    if (!comment) {
      return res.status(500).json({
        message: "parent comment is not found",
      });
    }

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    const newReply = await Comment.create({
      blog: blogId,
      comment: reply,
      parentComment: parentCommentId,
      user: userId,
    }).then((reply) => {
      return reply.populate({
        path: "user",
        select: "name email",
      });
    });

    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: newReply._id },
    });

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      newReply,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}



  module.exports = {addComment,deleteComment,editComment,likeComment,addNestedComment}