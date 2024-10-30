const express = require("express");
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const route = express.Router();
route.post("/blogs",createBlog);
route.get("/blogs",getAllBlog);
route.get("/blogs/:id", getBlogById);
route.patch("/blogs/:id",updateBlog);
route.delete("/blogs/:id",deleteBlog);
module.exports = route 