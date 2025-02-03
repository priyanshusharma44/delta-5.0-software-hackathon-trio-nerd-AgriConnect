const express = require("express");
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require("../controller/blogController");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
    multer,
    storage
} = require("../utils/multer");

const upload = multer({
    storage: storage
})


const router = express.Router();

// ✅ Get all blogs (Public)
router.get("/", getAllBlogs);

// ✅ Get a single blog by ID (Public)
router.get("/:id", getBlogById);

// ✅ Create a blog with image upload (Only Authenticated Users)
router.post("/create", /* authMiddleware, */ upload.single("coverImg"), createBlog);

// ✅ Update a blog with image upload (Only Author or Admin)
router.put("/:id", /* authMiddleware, */ upload.single("coverImg"), updateBlog);

// ✅ Delete a blog (Only Author or Admin)
router.delete("/:id", /* authMiddleware, */ deleteBlog);

module.exports = router;
