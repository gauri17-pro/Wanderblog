const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// Create Blog
router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
});

// Get All Blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});


module.exports = router;
