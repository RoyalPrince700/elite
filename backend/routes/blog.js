import express from 'express';
import {
  getAllBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getBlogStats,
  uploadBlogImage
} from '../controllers/blogController.js';
import {
  getCommentsByBlog,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from '../controllers/commentController.js';
import {
  likeBlog,
  unlikeBlog,
  getLikeStatus
} from '../controllers/likeController.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { validateBlogCreation, validateBlogUpdate } from '../middleware/validators/blogValidators.js';
import { uploadBlogHeader, upload } from '../config/cloudinary.js';

const router = express.Router();

// Public blog routes
router.get('/', getPublishedBlogs);

// Admin blog management
router.get('/admin/all', authenticateToken, requireAdmin, getAllBlogs);
router.get('/admin/stats', authenticateToken, requireAdmin, getBlogStats);
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), uploadBlogImage);
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  uploadBlogHeader.single('headerImage'),
  validateBlogCreation,
  createBlog
);
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  uploadBlogHeader.single('headerImage'),
  validateBlogUpdate,
  updateBlog
);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlog);
router.put('/:id/publish', authenticateToken, requireAdmin, publishBlog);
router.put('/:id/unpublish', authenticateToken, requireAdmin, unpublishBlog);

// Blog likes
router.post('/:blogId/likes', authenticateToken, likeBlog);
router.delete('/:blogId/likes', authenticateToken, unlikeBlog);
router.get('/:blogId/likes/status', authenticateToken, getLikeStatus);

// Comments
router.get('/:blogId/comments', optionalAuth, getCommentsByBlog);
router.post('/:blogId/comments', authenticateToken, createComment);
router.put('/comments/:commentId', authenticateToken, updateComment);
router.delete('/comments/:commentId', authenticateToken, deleteComment);

// Comment likes
router.post('/comments/:commentId/likes', authenticateToken, likeComment);
router.delete('/comments/:commentId/likes', authenticateToken, unlikeComment);
router.get('/comments/:commentId/likes/status', authenticateToken, getLikeStatus);

// Blog detail route (keep last to avoid conflicts)
router.get('/:slug', optionalAuth, getBlogBySlug);

export default router;

