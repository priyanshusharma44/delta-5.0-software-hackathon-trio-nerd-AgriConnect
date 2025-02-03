const { Comment } = require('../model');
const catchAsyncError = require('../utils/catchAsyncError');
// ✅ Create a Comment (Authenticated Users)
exports.createComment = catchAsyncError(async (req, res, next) => {
  try {
    const { comment, postId } = req.body;

    const newComment = await Comment.create({
      comment,
      postId,
      userId: req.user.id, // Attach logged-in user's ID
    });

    res
      .status(201)
      .json({
        success: true,
        message: 'Comment added successfully',
        newComment,
      });
  } catch (error) {
    next(error);
  }
});

// ✅ Get All Comments for a Blog Post
exports.getCommentsByBlog = catchAsyncError(async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.id },
      include: 'user',
    });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
});

//get total commments count
exports.getTotalCommentsCount = catchAsyncError(async (req, res, next) => {
  try {
    const totalComments = await Comment.count({
      where: { postId: req.params.id },
    });

    res.status(200).json({ success: true, totalComments });
  } catch (error) {
    next(error);
  }
});

// ✅ Update a Comment (Only Author)
exports.updateComment = catchAsyncError(async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });

    // ✅ Only the author can update
    if (req.user.id !== comment.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await comment.update({ comment: req.body.comment });
    res
      .status(200)
      .json({
        success: true,
        message: 'Comment updated successfully',
        comment,
      });
  } catch (error) {
    next(error);
  }
});

// ✅ Delete a Comment (Only Author or Admin)
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });

    // ✅ Only the author or an admin can delete
    if (req.user.id !== comment.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await comment.destroy();
    res
      .status(200)
      .json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});
