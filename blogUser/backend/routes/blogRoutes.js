const express = require("express");
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const verifyUser = require("../middlewares/auth");
const route = express.Router();
route.post("/blogs",verifyUser,createBlog);
route.get("/blogs",getAllBlog);
route.get("/blogs/:id", getBlogById);
route.patch("/blogs/:id",verifyUser,updateBlog);
route.delete("/blogs/:id",verifyUser,deleteBlog);
module.exports = route 