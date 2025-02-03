const Blog = require("./../model/blogModel")
const catchAsyncError = require("../utils/catchAsyncError");
const path = require("path");

// ✅ Create a Blog with File Upload
exports.createBlog = catchAsyncError(async (req, res, next) => {
  console.log("Hello world");
  try {
    const { title, description, content, category, rating } = req.body;
    const coverImg = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

    console.log(title, description, content, coverImg, category, rating);

    const blog = await Blog.create({
      title,
      description,
      content,
      coverImg,
      category,
      rating, // Attach logged-in user's ID, assuming ID 3 for now
    });

    console.log(blog)
    res.status(201).json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    next(error);
  }
});

// ✅ Get All Blogs (Public)
exports.getAllBlogs = catchAsyncError(async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

// ✅ Get Blog by ID (Public)
exports.getBlogById = catchAsyncError(async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id, { include: "author" });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
});

// ✅ Update Blog (Only Author or Admin)
exports.updateBlog = catchAsyncError(async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // ✅ Only the author or an admin can update
    if (req.user.id !== blog.authorId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // ✅ If a new file is uploaded, update the coverImg path
    if (req.file) {
      req.body.coverImg = `/uploads/${req.file.filename}`;
    }

    await blog.update(req.body);
    res.status(200).json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
});

// ✅ Delete Blog (Only Author or Admin)
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // ✅ Only the author or an admin can delete
    if (req.user.id !== blog.authorId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await blog.destroy();
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
});
