import {
  likeBlog,
  unlikeBlog,
  getLikeStatus
} from '../controllers/likeController.js';
import {
  createTestUser,
  createTestBlog,
  createTestLike,
  createMockRequest,
  createMockResponse
} from './testUtils.js';
import Like from '../models/Like.js';

describe('Like Controller', () => {
  describe('likeBlog', () => {
    it('should like a blog post', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await likeBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Blog liked successfully'
        })
      );

      // Verify like was created
      const like = await Like.findOne({
        user: user._id,
        targetType: 'Blog',
        targetId: blog._id
      });
      expect(like).toBeTruthy();
    });

    it('should prevent duplicate likes', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      await createTestLike('Blog', blog._id, { user });

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await likeBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Blog already liked'
        })
      );
    });
  });

  describe('unlikeBlog', () => {
    it('should unlike a blog post', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      await createTestLike('Blog', blog._id, { user });

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await unlikeBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Blog unliked successfully'
        })
      );

      // Verify like was removed
      const like = await Like.findOne({
        user: user._id,
        targetType: 'Blog',
        targetId: blog._id
      });
      expect(like).toBeNull();
    });

    it('should handle unliking non-existent like gracefully', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await unlikeBlog(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Blog unliked successfully'
        })
      );
    });
  });

  describe('getLikeStatus', () => {
    it('should return like status for blog', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      await createTestLike('Blog', blog._id, { user });

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await getLikeStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            liked: true,
            likesCount: 1
          }
        })
      );
    });

    it('should return not liked status when no like exists', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();

      const req = createMockRequest({
        params: { blogId: blog._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await getLikeStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            liked: false,
            likesCount: 0
          }
        })
      );
    });

    it('should work with comment likes', async () => {
      const user = await createTestUser();
      const blog = await createTestBlog();
      const comment = await createTestComment(blog._id);
      await createTestLike('Comment', comment._id, { user });

      const req = createMockRequest({
        params: { commentId: comment._id.toString() },
        user: { _id: user._id }
      });
      const res = createMockResponse();

      await getLikeStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            liked: true,
            likesCount: 1
          }
        })
      );
    });
  });
});
