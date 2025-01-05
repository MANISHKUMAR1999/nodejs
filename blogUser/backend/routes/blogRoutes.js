const express = require("express");
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog, likeBlog, saveBlog} = require("../controllers/blogController");
const verifyUser = require("../middlewares/auth");
const { addComment, deleteComment, editComment, likeComment,addNestedComment } = require("../controllers/commentController");
const upload = require("../utils/multer");
const route = express.Router();

//blogs
route.post("/blogs",verifyUser,upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),createBlog);
route.get("/blogs",getAllBlog);
route.get("/blogs/:blogId", getBlogById);
route.patch("/blogs/:id",verifyUser,upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),updateBlog);
route.delete("/blogs/:id",verifyUser,deleteBlog);

//like/dislike blog
route.post("/blogs/like/:id",verifyUser,likeBlog);

//comment add/delete
route.post("/blogs/comment/:id",verifyUser,addComment);
route.delete("/blogs/comment/:id",verifyUser,deleteComment);
route.patch("/blogs/edit-comment/:id",verifyUser,editComment);
route.patch("/blogs/like-comment/:id",verifyUser,likeComment);

// Nested comment

route.post("/comment/:parentCommentId/:id", verifyUser, addNestedComment);

// save blog / bookmark blog
route.patch("/save-blog/:id", verifyUser, saveBlog);
module.exports = route 