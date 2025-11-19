import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import Like from '../models/Like.js';
import { likeComment as likeCommentHandler, unlikeComment as unlikeCommentHandler } from './likeController.js';

const { ObjectId } = mongoose.Types;

const formatComment = (commentDoc, viewerId) => {
  const comment = commentDoc.toObject();
  const id = comment._id.toString();
  const parentId = comment.parentComment ? comment.parentComment.toString() : null;
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const viewerHasLiked = viewerId
    ? likes.some((likeId) => likeId.toString() === viewerId)
    : false;

  return {
    ...comment,
    id: comment._id,
    parentComment: parentId,
    likesCount: likes.length,
    viewerHasLiked,
    replies: []
  };
};

const buildCommentTree = (comments, viewerId) => {
  const commentMap = new Map();
  const roots = [];

  comments.forEach((commentDoc) => {
    const formatted = formatComment(commentDoc, viewerId);
    commentMap.set(formatted.id.toString(), formatted);
  });

  commentMap.forEach((comment) => {
    if (comment.parentComment) {
      const parent = commentMap.get(comment.parentComment.toString());
      if (parent) {
        parent.replies.push(comment);
      } else {
        roots.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  // Sort replies chronologically for consistency
  const sortReplies = (items) => {
    items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    items.forEach((item) => sortReplies(item.replies || []));
  };

  sortReplies(roots);
  return roots;
};

const collectDescendantCommentIds = async (rootId) => {
  const ids = [rootId];
  const queue = [rootId];

  while (queue.length) {
    const currentId = queue.shift();
    // eslint-disable-next-line no-await-in-loop
    const children = await Comment.find({ parentComment: currentId }).select('_id');
    children.forEach((child) => {
      ids.push(child._id);
      queue.push(child._id);
    });
  }

  return ids;
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog identifier'
      });
    }

    const blogExists = await Blog.exists({ _id: blogId });
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const viewerId = req.user?._id?.toString();

    const comments = await Comment.find({ blog: blogId })
      .populate('author', 'fullName avatar role')
      .sort({ createdAt: 1 });

    const tree = buildCommentTree(comments, viewerId);

    return res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentComment } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog identifier'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog || (!blog.published && req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    let parent = null;
    if (parentComment) {
      if (!mongoose.isValidObjectId(parentComment)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent comment'
        });
      }

      parent = await Comment.findById(parentComment);
      if (!parent || parent.blog.toString() !== blogId) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment not found for this blog'
        });
      }
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      blog: blogId,
      parentComment: parent ? parent._id : null
    });

    await comment.populate('author', 'fullName avatar role');

    return res.status(201).json({
      success: true,
      data: formatComment(comment, req.user._id.toString()),
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const comment = await Comment.findById(commentId).populate('author', 'fullName avatar role');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const isAuthor = comment.author._id.toString() === req.user._id.toString();
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    comment.content = content.trim();
    await comment.save();

    return res.json({
      success: true,
      data: formatComment(comment, req.user._id.toString()),
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    const commentIds = await collectDescendantCommentIds(comment._id);

    await Promise.all([
      Comment.deleteMany({ _id: { $in: commentIds } }),
      Like.deleteMany({ targetType: 'Comment', targetId: { $in: commentIds } })
    ]);

    return res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
};

export const likeComment = (req, res) => likeCommentHandler(req, res);
export const unlikeComment = (req, res) => unlikeCommentHandler(req, res);

