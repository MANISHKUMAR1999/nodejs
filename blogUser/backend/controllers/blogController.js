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
  //  console.log(await decodedJWT(req.body.token))
//     let isValid = await verifyJWT(req.body.token);
//     console.log("isvalid",isValid)
    
//   if(!isValid){
//     return res.status(200).json({"message":"InValid token","success":"false"})
//   }
  // added the creatorfrom user object
  // const creator = req.user;
  //   const {title,description,draft} = req.body
  //   //const image=req.file
  //   const { image, images } = req.files;
  //   const content = JSON.parse(req.body.content);
  //   console.log({image,title,description,image,images})

  //   let imageIndex = 0;

  //   for(let i=0;i<content.blocks.length;i++){
  //     const block = content.blocks[i]
  //     if(block.type === 'image'){
  //       const { secure_url, public_id } = await uploadImageToCloudinary(
  //         `data:image/jpeg;base64,${images[imageIndex].buffer.toString(
  //           "base64"
  //         )}`
  //       );
  //       console.log(secure_url,public_id)

  //      block.data.file = {
  //         url: secure_url,
  //         imageId: public_id,
  //       };
  //       imageIndex++;
  //     }
  //   }
  try {
    const creator = req.user;

    const { title, description, draft } = req.body;
    const { image, images } = req.files;

    const content = JSON.parse(req.body.content);

    if (!title) {
      return res.status(400).json({
        message: "Please fill title field",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Please fill description field",
      });
    }

    if (!content) {
      return res.status(400).json({
        message: "Please add some content",
      });
    }

    //cloudinary wali prikriya shuru karo

    let imageIndex = 0;

    for (let i = 0; i < content.blocks.length; i++) {
      const block = content.blocks[i];
      if (block.type === "image") {
        const { secure_url, public_id } = await uploadImageToCloudinary(
          `data:image/jpeg;base64,${images[imageIndex].buffer.toString(
            "base64"
          )}`
        );

        block.data.file = {
          url: secure_url,
          imageId: public_id,
        };

        imageIndex++;
      }
    }

    const { secure_url, public_id } = await uploadImageToCloudinary(
      `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`
    );

    const blogId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();
    // const blogId = title.toLowerCase().replace(/ +/g, '-')

    const blog = await Blog.create({
      description,
      title,
      draft,
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
      content,
    });

    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

    return res.status(200).json({
      message: "Blog created Successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
        // const blog = await Blog.findOne({blogId}).populate({
        //   path:'comments',
        //   populate:[{
        //     path:'user',
        //     select:'-password'
        //   },{
        //     path:"replies",
        //     populate:{
        //       path:'user',
        //       select:'name email'
        //     }
        //   }]
        // }).populate({
        //   path:'creator',
        //   select:"name email"
        // })
        const blog = await Blog.findOne({ blogId })
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "name email",
          },
        })
        .populate({
          path: "creator",
          select: "name email",
        })
        .lean();
       
  
      async function populateReplies(comments) {
        for (const comment of comments) {
          let populatedComment = await Comment.findById(comment._id)
            .populate({
              path: "replies",
              populate: {
                path: "user",
                select: "name email",
              },
            })
            .lean();
  
          comment.replies = populatedComment.replies;
  
          if (comment.replies && comment.replies.length > 0) {
            await populateReplies(comment.replies);
          }
        }
        return comments;
      }
  
      blog.comments = await populateReplies(blog.comments);
  

        if(!blog){
          res.status(404).json({"success":"true","message":"blog not found"})
        }
       
        return res.status(200).json({"success":"true","message":"blog fetched successfully",blog})
    }
    catch(error){
        return res.status(500).json({"error":error.message})
    }
}

async function updateBlog(req,res){
  try {
    const creator = req.user;

    const { id } = req.params;

    const { title, description, draft } = req.body;

    const content = JSON.parse(req.body.content);
    const existingImages = JSON.parse(req.body.existingImages);

    const blog = await Blog.findOne({ blogId: id });

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!(creator == blog.creator)) {
      return res.status(500).json({
        message: "You are not authorized for this action",
      });
    }

    // console.log(blog);

    let imagesToDelete = blog.content.blocks
      .filter((block) => block.type == "image")
      .filter(
        (block) => !existingImages.find(({ url }) => url == block.data.file.url)
      )
      .map((block) => block.data.file.imageId);

    // if (imagesToDelete.length > 0) {
    //   await Promise.all(
    //     imagesToDelete.map((id) => deleteImagefromCloudinary(id))
    //   );
    // }

    if (req.files.images) {
      let imageIndex = 0;

      for (let i = 0; i < content.blocks.length; i++) {
        const block = content.blocks[i];
        if (block.type === "image" && block.data.file.image) {
          const { secure_url, public_id } = await uploadImageToCloudinary(
            `data:image/jpeg;base64,${req.files.images[
              imageIndex
            ].buffer.toString("base64")}`
          );

          block.data.file = {
            url: secure_url,
            imageId: public_id,
          };

          imageIndex++;
        }
      }
    }

    // const updatedBlog = await Blog.updateOne(
    //   { _id: id },
    //   {
    //     title,
    //     description,
    //     draft,
    //   }
    // );

    if (req?.files?.image) {
      await deleteImagefromCloudinary(blog.imageId);
      const { secure_url, public_id } = await uploadImageToCloudinary(
        `data:image/jpeg;base64,${req?.files?.image[0]?.buffer?.toString(
          "base64"
        )}`
      );
      blog.image = secure_url;
      blog.imageId = public_id;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.draft = draft || blog.draft;
    blog.content = content || blog.content;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
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
        const user = req.user;
        const {id} = req.params;
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(500).json({
              message: "Blog is not found",
            });
          }
          // console.log(blog)
          // console.log(creator)
      
         if(!blog.likes.includes(user)){
            await Blog.findByIdAndUpdate(id,{$push:{likes:user}})
            await User.findByIdAndUpdate(user,{$push:{likeBlogs:id}})
            return res.status(200).json({"success":true,"message":"Blog Likes Successfully","isLiked":true})
         }
         else{
            await Blog.findByIdAndUpdate(id, { $pull: { likes: user } });
            await User.findByIdAndUpdate(user,{$pull:{likeBlogs:id}})
            return res.status(200).json({"success":true,"message":"Blog disLikes Successfully","isLiked":false})

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

async function saveBlog(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!blog.totalSaves.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $set: { totalSaves: user } });
      await User.findByIdAndUpdate(user, { $set: { saveBlogs: id } });
      return res.status(200).json({
        success: true,
        message: "Blog has been saved",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $unset: { totalSaves: user } });
      await User.findByIdAndUpdate(user, { $unset: { saveBlogs: id } });
      return res.status(200).json({
        success: true,
        message: "Blog Unsaved",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {createBlog,getAllBlog,getBlogById,updateBlog,deleteBlog,likeBlog,addComment,deleteComment,saveBlog}