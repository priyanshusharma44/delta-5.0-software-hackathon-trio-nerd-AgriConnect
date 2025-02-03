const express = require("express");
const { getCommentsByBlog, createComment, updateComment, deleteComment, getTotalCommentsCount } = require("../controller/commentController");
const { authMiddleware } = require("../middleware/authMiddleware");


const router = express.Router();

// ✅ Get comments for a blog post (Public)
router.get("/:id", getCommentsByBlog);

// ✅ Create a comment (Only Authenticated Users)
router.post("/create-comment", authMiddleware, createComment);
//get total comments
router.get("/:id/count", getTotalCommentsCount);

// ✅ Update a comment (Only Author)
router.put("/:id", authMiddleware, updateComment);

// ✅ Delete a comment (Only Author or Admin)
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
