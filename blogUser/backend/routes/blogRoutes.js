const express = require("express");
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog, likeBlog } = require("../controllers/blogController");
const verifyUser = require("../middlewares/auth");
const { addComment, deleteComment, editComment, likeComment } = require("../controllers/commentController");
const upload = require("../utils/multer");
const route = express.Router();

//blogs
route.post("/blogs",verifyUser,upload.single("image"),createBlog);
route.get("/blogs",getAllBlog);
route.get("/blogs/:blogId", getBlogById);
route.patch("/blogs/:id",verifyUser,updateBlog);
route.delete("/blogs/:id",verifyUser,deleteBlog);

//like/dislike blog
route.post("/blogs/like/:id",verifyUser,likeBlog);

//comment add/delete
route.post("/blogs/comment/:id",verifyUser,addComment);
route.delete("/blogs/comment/:id",verifyUser,deleteComment);
route.patch("/blogs/edit-comment/:id",verifyUser,editComment);
route.patch("/blogs/like-comment/:id",verifyUser,likeComment);
module.exports = route 