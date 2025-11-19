import mongoose from 'mongoose';
import Like from '../models/Like.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

const { ObjectId } = mongoose.Types;

const ensureBlog = async (blogId) => {
  if (!mongoose.isValidObjectId(blogId)) {
    throw new Error('Invalid blog identifier');
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new Error('BLOG_NOT_FOUND');
  }

  return blog;
};

const ensureComment = async (commentId) => {
  if (!mongoose.isValidObjectId(commentId)) {
    throw new Error('Invalid comment identifier');
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('COMMENT_NOT_FOUND');
  }

  return comment;
};

const buildLikeQuery = (targetType, targetId, userId) => ({
  user: userId,
  targetType,
  targetId: targetId instanceof ObjectId ? targetId : new ObjectId(targetId)
});

const resolveTarget = (req) => {
  if (req.params?.blogId) {
    return { targetType: 'Blog', targetId: req.params.blogId };
  }
  if (req.params?.commentId) {
    return { targetType: 'Comment', targetId: req.params.commentId };
  }
  if (req.query?.targetId && req.query?.targetType) {
    return {
      targetType: req.query.targetType === 'Comment' ? 'Comment' : 'Blog',
      targetId: req.query.targetId
    };
  }

  throw new Error('TARGET_NOT_PROVIDED');
};

export const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    await ensureBlog(blogId);

    const likeQuery = buildLikeQuery('Blog', blogId, req.user._id);

    await Like.updateOne(
      likeQuery,
      { $setOnInsert: likeQuery },
      { upsert: true }
    );

    const totalLikes = await Like.countDocuments({
      targetType: 'Blog',
      targetId: likeQuery.targetId
    });

    return res.json({
      success: true,
      data: {
        liked: true,
        totalLikes
      },
      message: 'Blog liked successfully'
    });
  } catch (error) {
    if (error.message === 'BLOG_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    if (error.message === 'Invalid blog identifier') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog identifier'
      });
    }
    console.error('Error liking blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to like blog'
    });
  }
};

export const unlikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    await ensureBlog(blogId);

    const likeQuery = buildLikeQuery('Blog', blogId, req.user._id);

    await Like.deleteOne(likeQuery);

    const totalLikes = await Like.countDocuments({
      targetType: 'Blog',
      targetId: likeQuery.targetId
    });

    return res.json({
      success: true,
      data: {
        liked: false,
        totalLikes
      },
      message: 'Blog unliked successfully'
    });
  } catch (error) {
    if (error.message === 'BLOG_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    if (error.message === 'Invalid blog identifier') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog identifier'
      });
    }
    console.error('Error unliking blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlike blog'
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await ensureComment(commentId);

    const likeQuery = buildLikeQuery('Comment', commentId, req.user._id);

    await Like.updateOne(
      likeQuery,
      { $setOnInsert: likeQuery },
      { upsert: true }
    );

    const updatedComment = await Comment.findByIdAndUpdate(
      comment._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    return res.json({
      success: true,
      data: {
        commentId: updatedComment._id,
        likesCount: updatedComment.likes.length,
        viewerHasLiked: true
      },
      message: 'Comment liked successfully'
    });
  } catch (error) {
    if (error.message === 'COMMENT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    if (error.message === 'Invalid comment identifier') {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment identifier'
      });
    }
    console.error('Error liking comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to like comment'
    });
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await ensureComment(commentId);
    const likeQuery = buildLikeQuery('Comment', commentId, req.user._id);

    await Like.deleteOne(likeQuery);

    const updatedComment = await Comment.findByIdAndUpdate(
      comment._id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    return res.json({
      success: true,
      data: {
        commentId: updatedComment._id,
        likesCount: updatedComment.likes.length,
        viewerHasLiked: false
      },
      message: 'Comment unliked successfully'
    });
  } catch (error) {
    if (error.message === 'COMMENT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    if (error.message === 'Invalid comment identifier') {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment identifier'
      });
    }
    console.error('Error unliking comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlike comment'
    });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const { targetType, targetId } = resolveTarget(req);

    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target identifier'
      });
    }

    const likeQuery = buildLikeQuery(targetType, targetId, req.user._id);

    const [existingLike, totalLikes] = await Promise.all([
      Like.findOne(likeQuery),
      Like.countDocuments({
        targetType,
        targetId: likeQuery.targetId
      })
    ]);

    return res.json({
      success: true,
      data: {
        liked: Boolean(existingLike),
        totalLikes
      }
    });
  } catch (error) {
    if (error.message === 'TARGET_NOT_PROVIDED') {
      return res.status(400).json({
        success: false,
        message: 'Target identifier is required'
      });
    }
    console.error('Error fetching like status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch like status'
    });
  }
};

