const express = require("express");
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog, likeBlog, addComment, deleteComment } = require("../controllers/blogController");
const verifyUser = require("../middlewares/auth");
const route = express.Router();

//blogs
route.post("/blogs",verifyUser,createBlog);
route.get("/blogs",getAllBlog);
route.get("/blogs/:id", getBlogById);
route.patch("/blogs/:id",verifyUser,updateBlog);
route.delete("/blogs/:id",verifyUser,deleteBlog);

//like/dislike blog
route.post("/blogs/like/:id",verifyUser,likeBlog);

//comment add/delete
route.post("/blogs/comment/:id",verifyUser,addComment);
route.delete("/blogs/comment/:id",verifyUser,deleteComment);
module.exports = route 